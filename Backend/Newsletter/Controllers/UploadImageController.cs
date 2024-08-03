using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newsletter.Models;
using Newsletter.ViewModels;

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
