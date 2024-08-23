using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newsletter.Models;
using Newsletter.ViewModels;
using System.IdentityModel.Tokens.Jwt;

namespace Newsletter.Controllers
{
    [Route("api/editor")]
    [ApiController]
    public class EditorController : ControllerBase
    {
        private readonly Supabase.Client client;

        public EditorController(Supabase.Client _client)
        {
            client = _client ?? throw new ArgumentNullException(nameof(_client));
        }

        [HttpPatch("verify/{id}")]
        public async Task<IActionResult> VerifyContent(string id, [FromBody] VerifyRequestModel model)
        {
            if (string.IsNullOrEmpty(id) || model == null || string.IsNullOrEmpty(model.From))
            {
                return BadRequest("Invalid ID or token provided");
            }

            string editorId;
            try
            {
                var handler = new JwtSecurityTokenHandler();
                var jsonToken = handler.ReadToken(model.From) as JwtSecurityToken;

                editorId = jsonToken?.Claims.FirstOrDefault(claim => claim.Type == "sub")?.Value;

                if (string.IsNullOrEmpty(editorId))
                {
                    return BadRequest("Invalid token: Unable to extract editor ID");
                }
            }
            catch (Exception)
            {
                return BadRequest("Invalid token provided");
            }

            try
            {
                if (editorId == id) { return StatusCode(StatusCodes.Status401Unauthorized); }
                var updateResult = await client
                    .From<NewsArticle>()
                    .Where(x => x.Id == id)
                    .Set(x => x.IsVerified, true)
                    .Set(x => x.IsRejected, false)
                    .Update();

                if (updateResult == null)
                {
                    return NotFound($"News with id = {id} was not found");
                }

                var response = await client.From<NewsArticle>().Where(x => x.Id == id).Get();
                if (response.Models == null || !response.Models.Any())
                {
                    return NotFound($"Article with id = {id} not found");
                }
                var authorId = response.Models.First().UserId;
                var title = response.Models.First().Title;

              
                var notification = new Notifications
                {
                    SenderId = editorId,
                    RecieverId = authorId,
                    Message = $"Your article '{title}' has been verified.",
                    IsRead = false,
                    NotificationType = "ArticleVerified",
                    CreatedAt = DateTime.UtcNow
                };

                var notificationResponse = await client.From<Notifications>().Insert(notification);
                if (notificationResponse.Models == null || !notificationResponse.Models.Any())
                {
                    return StatusCode(StatusCodes.Status500InternalServerError, "Failed to create notification");
                }

                return Ok(new { message = "Content verified successfully and notification sent" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error occurred while verifying content with id = {id}: {ex}");
                return StatusCode(StatusCodes.Status500InternalServerError,
                    $"Error occurred while verifying content with id = {id}");
            }
        }


        [HttpPatch("reject/{id}")]
        public async Task<IActionResult> RejectContent(string id, [FromBody] RejectRequestModel model)
        {
            if (string.IsNullOrEmpty(id))
            {
                return BadRequest("Invalid ID provided");
            }

            string editorId;

            try
            {
                var handler = new JwtSecurityTokenHandler();
                var jsonToken = handler.ReadToken(model.From) as JwtSecurityToken;
                editorId = jsonToken?.Claims.First(claim => claim.Type == "sub")?.Value;
                if (string.IsNullOrEmpty(editorId))
                {
                    return BadRequest("Invalid token: Unable to extract editor ID");
                }
            }
            catch (Exception)
            {
                return BadRequest("Invalid token provided");
            }


            try
            {
                if (editorId == id) { return StatusCode(StatusCodes.Status401Unauthorized); }
                var updateResult = await client
                    .From<NewsArticle>()
                    .Where(x => x.Id == id)
                    .Set(x => x.IsVerified, true)
                    .Set(x => x.IsRejected, true)
                    .Update();
                if (updateResult == null)
                {
                    return NotFound($"News with id = {id} was not found");
                }


                var response = await client.From<NewsArticle>().Where(x => x.Id == id).Get();
                if (response.Models == null || !response.Models.Any())
                {
                    return NotFound($"Article with id = {id} not found");
                }
                var authorId = response.Models.First().UserId;
                var title = response.Models.First().Title;

                var notification = new Notifications
                {
                    SenderId = editorId,
                    RecieverId = authorId,
                    Message = $"Your article '{title}' has been rejected.\nFeedback: {model.Message}",
                    IsRead = false,
                    NotificationType = "ArticleRejected",
                    CreatedAt = DateTime.UtcNow
                };

                var notificationResponse = await client.From<Notifications>().Insert(notification);
                if (notificationResponse.Models == null || !notificationResponse.Models.Any())
                {
                    return StatusCode(StatusCodes.Status500InternalServerError, "Failed to create notification");
                }

                return Ok(new { message = "Content rejected successfully and notification sent" });
            }
            catch (Exception ex)
            {
              
                Console.WriteLine($"Error occurred while rejecting content with id = {id}: {ex}");
                return StatusCode(StatusCodes.Status500InternalServerError,
                    $"Error occurred while rejecting content with id = {id}");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteContent(string id)
        {
            try
            {
                var findcontext = await client.From<NewsArticle>().Where(c => c.Id == id).Get();


                if (findcontext.Models.Count == 0) return NotFound($"News with id = {id} was not found");

                await client.From<NewsArticle>().Where(x => x.Id == id).Delete();

             
                return Ok(new { message = "Content deleted successfully" });

            }
            catch (Exception)
            {

                return StatusCode(StatusCodes.Status500InternalServerError, $"Error occured while deleting Content with id = {id}");
            }
        }
    }
}
