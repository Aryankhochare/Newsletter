using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newsletter.Models;
using Newsletter.ViewModels;
using System.Text.RegularExpressions;
using Supabase;

namespace Newsletter.Controllers
{
   [Route("newsletter")]
[ApiController]
public class UploadImageController : ControllerBase
{
    [HttpPost]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> CreateNewsLetter([FromForm] CreateNewsArticleVM article, Supabase.Client client)
    {
        try
        {

            var newsletter = new NewsArticle
            {
                Title = article.Title,
                EditorContent = article.EditorContent
            };

            var response = await client.From<NewsArticle>().Insert(newsletter);
            var newNewsletter = response.Models.FirstOrDefault();

            if (newNewsletter == null)
            {
                return BadRequest("Failed to create newsletter");
            }

            if (article.CoverImage != null)
            {
                using var memoryStream = new MemoryStream();
                await article.CoverImage.CopyToAsync(memoryStream);
                var lastIndexOfDot = article.CoverImage.FileName.LastIndexOf('.');
                string extension = article.CoverImage.FileName.Substring(lastIndexOfDot + 1);
                await client.Storage.From("news_image")
                    .Upload(memoryStream.ToArray(), $"newsletter-{newNewsletter.Id}.{extension}");
            }

            var base64ImageMatches = Regex.Matches(newsletter.EditorContent, @"data:image\/([^;]+);base64,([^""]+)");
            foreach(Match match in base64ImageMatches)
            {   
                    

                        var imageType= match.Groups[1].Value;
                    var base64Image = match.Groups[2].Value;
                    var blob = Convert.FromBase64String(base64Image);
                    
                    string fileExtension = imageType switch
                    {
                        "jpeg" => "jpg",
                        "png" => "png",
                        "gif" => "gif",
                        "bmp" => "bmp",
                        "webp" => "webp",
                        _ => "png" 
                    };
                    var filename = $"newsletter-{newNewsletter.Id}-content-{Guid.NewGuid()}.{fileExtension}";
                    var storageResponse = await client.Storage
                        .From("news_image")
                        .Upload(blob, filename );
                    if (storageResponse == null)  
                    {
                        return BadRequest(new { error = "Failed to upload image to Supabase storage", details = "an unknown error occured" });
                    }
                    var imageUrl = client.Storage
                        .From("news_image")
                        .GetPublicUrl(filename);

                    newsletter.EditorContent = newsletter.EditorContent.Replace(match.Value, imageUrl);
            }
                newsletter.Id = newNewsletter.Id;
                await client.From<NewsArticle>()
                     .Update(newsletter);

                return Ok(new { Id = newNewsletter.Id });
        }
        catch (Exception ex)
        {
            // Log the exception
            Console.WriteLine($"Error creating newsletter: {ex}");
            return StatusCode(500, "An error occurred while creating the newsletter");
        }
    }
}
}
