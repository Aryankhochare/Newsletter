using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newsletter.Models;
using Newsletter.ViewModels;
using Supabase;
using System.Collections.Concurrent;
using System.Text.RegularExpressions;

namespace Newsletter.Controllers
{
    [Route("newslettertest")]
    [ApiController]
    public class UploadImageController : ControllerBase
    {
        private readonly Supabase.Client client;
        public UploadImageController(Client _client)
        {
            client = _client ?? throw new ArgumentNullException(nameof(_client));
        }

        [HttpPost]
        [Consumes("multipart/form-data")]
        //[Authorize(Policy = "WriteAccess")]
        public async Task<IActionResult> CreateNewsLetter([FromForm] CreateNewsTestVM article)
        {
            try
            {

                var newsletter = new NewsTest
                {
                    Title = article.Title,
                    EditorContent = article.EditorContent
                };

                var response = await client.From<NewsTest>().Insert(newsletter);
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
                await client.From<NewsTest>()
                     .Update(newsletter);

                return Ok(new { Id = newNewsletter.Id });
            }
            catch (Exception ex)
            {
   
                Console.WriteLine($"Error creating newsletter: {ex}");
                return StatusCode(500, "An error occurred while creating the newsletter");
            }


        }
    }
}
   