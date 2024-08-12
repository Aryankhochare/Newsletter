using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Newsletter.Models;
using Newsletter.ViewModels;
using Supabase;
using System.IdentityModel.Tokens.Jwt;
using System.Security.AccessControl;
using System.Text;

namespace Newsletter.Controllers
{
    [Route("newsletter")]
    [ApiController]
    public class NewsLetterController : ControllerBase
    {
        private readonly Supabase.Client client;
        private readonly IConfiguration configuration;
        public NewsLetterController(Client _client, IConfiguration _configuration)
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
            var response = await client.From<Category>()
                                       .Select("category_id")
                                       .Where(x => x.CategoryName == categoryName)
                                       .Single();
            return response?.CategoryId;
        }


        [HttpPost]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> CreateArticle([FromForm] CreateNewsArticleVM article)
        {
            try
            {
                var authHeader = Request.Headers["Authorization"].FirstOrDefault();
                if (authHeader != null && authHeader.StartsWith("Bearer "))
                {
                    var token = authHeader.Substring(7);
                    var userId = GetUserIdFromToken(token);
                    var categoryId = await GetCategoryIdByName(article.CategoryName);
                    if (string.IsNullOrEmpty(categoryId))
                    {
                        return BadRequest("Invalid category name");
                    }
                    var newsletter = new NewsArticle
                    {
                        UserId = userId,
                        CategoryId = categoryId, 
                        Title = article.Title,
                        EditorContent = article.EditorContent,
                        IsVerified = false,
                        IsRejected = false,
                        PostedOn = DateTime.UtcNow,
                        ModifiedDate = DateTime.UtcNow,
                    };
                    var response = await client.From<NewsArticle>().Insert(newsletter);
                    var newNewsletter = response.Models.First();
                    if (newNewsletter == null)
                    {
                        return BadRequest("Failed To create newsletter");
                    }
                    if (article.CoverImage != null)
                    {
                        using var memoryStream = new MemoryStream();
                        await article.CoverImage.CopyToAsync(memoryStream);
                        var lastIndexOfDot = article.CoverImage.FileName.LastIndexOf('.');
                        var extension = article.CoverImage.FileName.Substring(lastIndexOfDot + 1);
                        var filename = $"newsletter-{newNewsletter.Id}.{extension}";
                        await client.Storage.From("news_image")
                            .Upload(memoryStream.ToArray(), filename);
                        var url = client.Storage.From("news_image").GetPublicUrl(filename);
                        newNewsletter.CoverImage = url;

                        await client.From<NewsArticle>()
                            .Where(n => n.Id == newNewsletter.Id)
                            .Set(n => n.CoverImage, url)
                            .Update();
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
                return BadRequest("User Not Found");

              
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error creating newsletter: {ex}");
                return StatusCode(500, "An error occurred while creating the newsletter");
            }
        }
    
    }
}
