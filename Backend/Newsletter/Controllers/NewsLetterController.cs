using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Newsletter.Models;
using Newsletter.ViewModels;
using Supabase;
using Supabase.Postgrest;
using Supabase.Postgrest.Interfaces;
using System.IdentityModel.Tokens.Jwt;
using System.Security.AccessControl;
using System.Text;

namespace Newsletter.Controllers
{
    [Route("api/newsletter")]
    [ApiController]
    public class NewsLetterController : ControllerBase
    {
        private readonly Supabase.Client client;
        private readonly IConfiguration configuration;
        private Dictionary<string, string> categoryCache = new Dictionary<string, string>();
        public NewsLetterController(Supabase.Client _client, IConfiguration _configuration)
        {
            client = _client ?? throw new ArgumentNullException(nameof(_client));
            configuration = _configuration ?? throw new ArgumentNullException(nameof(_configuration));
        }

        private string GetUserIdFromToken(string token)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(configuration["JWT_Token"]);
            tokenHandler.ValidateToken(token, new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = false,
                ValidateAudience = false,
            }, out SecurityToken validatedToken);
            var jwtToken = (JwtSecurityToken)validatedToken;
            var user_id = jwtToken.Claims.First(i => i.Type == "sub").Value;
            return user_id;
        }

        private async Task<string> GetCategoryIdByName(string categoryName)
        {
            if (categoryCache.TryGetValue(categoryName, out string cacheId))
            {
                return cacheId;
            }
            var response = await client.From<Category>()
                                       .Select("category_id")
                                       .Where(x => x.CategoryName == categoryName)
                                       .Single();
            if (response?.CategoryId != null)
            {
                categoryCache[categoryName] = response.CategoryId;
                return response.CategoryId;
            }
            return null;
        }

        private async Task<string> UploadCoverImage(IFormFile coverImage, string newsletterId)
        {
            if (coverImage == null) return null;
            using var memoryStream = new MemoryStream();
            await coverImage.CopyToAsync(memoryStream);
            var lastIndexOfDot = coverImage.FileName.LastIndexOf('.');
            var extension = coverImage.FileName.Substring(lastIndexOfDot + 1);
            var filename = $"newsletter-{newsletterId}.{extension}";
            await client.Storage.From("news_image").Upload(memoryStream.ToArray(), filename);
            return client.Storage.From("news_image").GetPublicUrl(filename);
        }

        private async Task<string> ValidateAndGetUserId()
        {
            var authHeader = Request.Headers["Authorization"].FirstOrDefault();
            if (authHeader != null && authHeader.StartsWith("Bearer "))
            {
                var token = authHeader.Substring(7);
                return GetUserIdFromToken(token);
            }
            return null;
        }

        [HttpGet("search")]
        public async Task<IActionResult> Search([FromQuery] string category = null, [FromQuery] string writer = null, [FromQuery] string title = null)
        {
            try
            {
                var query = client.From<NewsArticle>() as IPostgrestTable<NewsArticle>;

                if (!string.IsNullOrEmpty(category))
                {
                    var categoryId = await GetCategoryIdByName(category);
                    if (string.IsNullOrEmpty(categoryId)) return BadRequest("Invalid Category Name");
                    query = query.Filter("category_id", Constants.Operator.Equals, categoryId);
                }

                if (!string.IsNullOrEmpty(writer))
                {
                    var userResponse = await client.From<Users>()
                        .Select("user_id")
                        .Where(x => x.Username == writer)
                        .Single();
                    if (userResponse == null) return BadRequest("Invalid writer name");
                    query = query.Filter("user_id", Constants.Operator.Equals, userResponse.Id);
                }

                if (!string.IsNullOrEmpty(title))
                {
                    query = query.Filter("news_title", Constants.Operator.ILike, $"%{title}%");
                }

                var response = await query.Get();

                if (response?.Models == null || !response.Models.Any())
                {
                    return NotFound("No articles found matching the search criteria");
                }

                var articles = response.Models.OrderByDescending(a => a.ModifiedDate);


                var categoriesResponse = await client.From<Category>().Get();
                var categories = categoriesResponse.Models ?? new List<Category>();

                var usersResponse = await client.From<Users>().Get();
                var users = usersResponse.Models ?? new List<Users>();

                var result = new List<object>();
                foreach (var article in articles)
                {
                    var newcategory = categories.FirstOrDefault(c => c.CategoryId == article.CategoryId);
                    var user = users.FirstOrDefault(u => u.Id == article.UserId);

                    var categoryName = newcategory?.CategoryName ?? string.Empty;
                    var userName = user?.Username ?? string.Empty;

                    result.Add(new
                    {
                        article.Id,
                        article.UserId,
                        userName,
                        article.CategoryId,
                        categoryName,
                        article.Title,
                        article.EditorContent,
                        article.PostedOn,
                        article.ModifiedDate,
                        article.IsVerified,
                        article.CoverImage,
                        article.IsRejected,
                    });
                }

                return Ok(result);
            }
            catch (Exception ex)
            {

                Console.WriteLine($"Error fetching article for searchbycategory: {ex}");
                return StatusCode(500, "An error occurred while fetching article based on category");
            }
        }

        [HttpPost]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> CreateArticle([FromForm] CreateNewsArticleVM article)
        {
            try
            {

                var userId = await ValidateAndGetUserId();
                if (userId == null) return Unauthorized("User not found");
                var categoryId = await GetCategoryIdByName(article.CategoryName);
                if (string.IsNullOrEmpty(categoryId))
                {
                    return BadRequest("Invalid category name");
                }

                var tempId = Guid.NewGuid().ToString();

                string coverImageUrl = null;
                if (article.CoverImage != null)
                {
                    coverImageUrl = await UploadCoverImage(article.CoverImage, tempId);
                }


                var newsletter = new NewsArticle
                {
                    UserId = userId,
                    CategoryId = categoryId,
                    Title = article.Title,
                    EditorContent = article.EditorContent,
                    IsVerified = false,
                    IsRejected = false,
                    IsDrafted = article.IsDrafted,
                    CoverImage = coverImageUrl,
                    PostedOn = DateTime.UtcNow,
                    ModifiedDate = DateTime.UtcNow,
                };
                var response = await client.From<NewsArticle>().Insert(newsletter);
                var newNewsletter = response.Models.First();
                if (newNewsletter == null)
                {
                    return BadRequest("Failed To create newsletter");
                }

                if (article.Images != null && article.ImageNames != null)
                {
                    for (int i = 0; i < article.Images.Count; i++)
                    {
                        using var memoryStream = new MemoryStream();
                        await article.Images[i].CopyToAsync(memoryStream);
                        string fileName = article.ImageNames[i];
                        await client.Storage.From("news_image")
                            .Upload(memoryStream.ToArray(), fileName);
                    }
                }
                newsletter.Id = newNewsletter.Id;
                await client.From<NewsArticle>()
                     .Update(newsletter);

                return Ok(new { Id = newNewsletter.Id });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error creating newsletter: {ex}");
                return StatusCode(500, "An error occurred while creating the newsletter");
            }
        }

        [HttpPatch("{news_id}")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> EditArticle(string news_id, [FromForm] CreateNewsArticleVM article)
        {
            try
            {
                var userId = await ValidateAndGetUserId();
                if (userId == null) return Unauthorized("User not found");
                var categoryId = await GetCategoryIdByName(article.CategoryName);
                if (string.IsNullOrEmpty(categoryId))
                {
                    return BadRequest("Invalid category name");
                }

                var tempId = Guid.NewGuid().ToString();

                //string coverImageUrl = null;

                var existingArticle = await client.From<NewsArticle>().Where(c => c.Id == news_id).Single();
                if (existingArticle == null)
                {
                    return NotFound("Article not found");
                }
                if (article.CoverImage != null && article.CoverImage.Length > 0)
                {
                    existingArticle.CoverImage = await UploadCoverImage(article.CoverImage, tempId);
                }

                existingArticle.CategoryId = categoryId;
                existingArticle.Title = article.Title;
                existingArticle.EditorContent = article.EditorContent;
                //existingArticle.CoverImage = coverImageUrl;
                existingArticle.ModifiedDate = DateTime.UtcNow;
                existingArticle.IsVerified = false;
                existingArticle.IsRejected = false;
                existingArticle.IsDrafted = article.IsDrafted;

                var response = await client.From<NewsArticle>().Where(c => c.Id == news_id).Update(existingArticle);

                if (article.Images != null && article.ImageNames != null)
                {
                    for (int i = 0; i < article.Images.Count; i++)
                    {
                        using var memoryStream = new MemoryStream();
                        await article.Images[i].CopyToAsync(memoryStream);
                        string fileName = article.ImageNames[i];
                        await client.Storage.From("news_image")
                            .Upload(memoryStream.ToArray(), fileName);
                    }
                }
                return Ok(new { Id = existingArticle.Id });


            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error creating newsletter: {ex}");
                return StatusCode(500, "An error occurred while creating the newsletter");
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetArticles()
        {
            try
            {
                // Fetch articles
                var articlesResponse = await client.From<NewsArticle>().Where(x => x.IsDrafted==false).Get();
                if (articlesResponse?.Models == null || !articlesResponse.Models.Any())
                {
                    return NotFound("Didn't find any article");
                }
                var articles = articlesResponse.Models.OrderByDescending(a => a.ModifiedDate) ;

                // Fetch categories
                var categoriesResponse = await client.From<Category>().Get();
                var categories = categoriesResponse.Models ?? new List<Category>();

                // Fetch users
                var usersResponse = await client.From<Users>().Get();
                var users = usersResponse.Models ?? new List<Users>();

                var result = new List<object>();
                foreach(var article in articles)
                {

                    var category = categories.FirstOrDefault(c => c.CategoryId == article.CategoryId);
                    var user = users.FirstOrDefault(u => u.Id == article.UserId);

                    var categoryName = category?.CategoryName ?? string.Empty;
                    var userName = user?.Username?? string.Empty;

                    result.Add(new
                    {
                        article.Id,
                        article.UserId,
                        userName,
                        article.CategoryId,
                        categoryName,
                        article.Title,
                        article.EditorContent,
                        article.PostedOn,
                        article.ModifiedDate,
                        article.IsVerified,
                        article.CoverImage,
                        article.IsRejected,
                    });

                };
                return Ok(result);
            
            }
            catch (Exception ex)
            {

                Console.WriteLine($"Error fetching newsletter: {ex}");
                return StatusCode(500, "An error occurred while fetching data from newsletter");
            }
        }


        [HttpGet("{id}")]
        public async Task<IActionResult> GetArticleById(string id)
        {
            try
            {
                // Fetch articles
                var articleResponse = await client.From<NewsArticle>().Where(x => x.Id == id).Get();
                if (articleResponse?.Models == null || !articleResponse.Models.Any())
                {
                    return NotFound("Didn't find any article");
                }
                var article = articleResponse.Models.FirstOrDefault();

                // Fetch categories
                var categoriesResponse = await client.From<Category>().Get();
                var categories = categoriesResponse.Models ?? new List<Category>();

                // Fetch users
                var usersResponse = await client.From<Users>().Get();
                var users = usersResponse.Models ?? new List<Users>();

                var result = new List<ArticleVM>();

                if (article != null)
                {
                    var category = categories.FirstOrDefault(c => c.CategoryId == article.CategoryId);
                    var user = users.FirstOrDefault(u => u.Id == article.UserId);

                    var categoryName = category?.CategoryName ?? string.Empty;
                    var userName = user?.Username ?? string.Empty;

                    result.Add(new ArticleVM
                    {
                        Id = article.Id,
                        UserId = article.UserId,
                        UserName = userName,
                        CategoryId = article.CategoryId,
                        CategoryName = categoryName,
                        Title = article.Title,
                        EditorContent = article.EditorContent,
                        PostedOn = article.PostedOn,
                        ModifiedDate = article.ModifiedDate,
                        IsVerified = article.IsVerified,
                        CoverImage = article.CoverImage,
                        IsRejected = article.IsRejected,
                    });
                }

                return Ok(result);

            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching newsletter: {ex}");
                return StatusCode(500, "An error occurred while fetching data from newsletter");
            }
        }


        [HttpGet("verified")]
        public async Task<IActionResult> GetVerifiedArticle()
        {
            try
            {
                
                var articlesResponse = await client.From<NewsArticle>()
                    .Filter("is_verified", Constants.Operator.Equals, "true")
                    .Filter("is_rejected", Constants.Operator.Equals, "false")
                    .Order("modified_on", Supabase.Postgrest.Constants.Ordering.Descending)
                    .Get();

                if (articlesResponse?.Models == null || !articlesResponse.Models.Any())
                {
                    return NotFound("Didn't find any verified article");
                }
                var articles = articlesResponse.Models.OrderByDescending(a => a.ModifiedDate);

               
                var categoriesResponse = await client.From<Category>().Get();
                var categories = categoriesResponse.Models ?? new List<Category>();

     
                var usersResponse = await client.From<Users>().Get();
                var users = usersResponse.Models ?? new List<Users>();

                var result = new List<object>();
                foreach (var article in articles)
                {
                    var category = categories.FirstOrDefault(c => c.CategoryId == article.CategoryId);
                    var user = users.FirstOrDefault(u => u.Id == article.UserId);

                    var categoryName = category?.CategoryName ?? string.Empty;
                    var userName = user?.Username ?? string.Empty;

                    result.Add(new
                    {
                        article.Id,
                        article.UserId,
                        userName,
                        article.CategoryId,
                        categoryName,
                        article.Title,
                        article.EditorContent,
                        article.PostedOn,
                        article.ModifiedDate,
                        article.IsVerified,
                        article.CoverImage,
                        article.IsRejected,
                    });
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching verified articles: {ex}");
                return StatusCode(500, "An error occurred while fetching verified articles");
            }
        }


        [HttpDelete("{id}")]
     public async Task<IActionResult> DeleteComment(string id)
      {
    try
    {
        var findarticle = await client.From<NewsArticle>().Where(c => c.Id == id).Get();
 
        if (findarticle.Models.Count == 0) return NotFound($"Article with id = {id} was not found");
 
        await client.From<NewsArticle>().Where(x => x.Id == id).Delete();
 
        //return NoContent();
        return Ok(new { message = "Article deleted successfully" });
    }
    catch (Exception)
    {
        return StatusCode(StatusCodes.Status500InternalServerError, $"Error occured while deleting Article with id = {id}");
     }
 }



    }

}
