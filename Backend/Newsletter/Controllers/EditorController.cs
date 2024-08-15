using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newsletter.Models;

namespace Newsletter.Controllers
{
    [Route("editor")]
    [ApiController]
    public class EditorController : ControllerBase
    {
        private readonly Supabase.Client client;

        public EditorController(Supabase.Client _client)
        {
            client = _client ?? throw new ArgumentNullException(nameof(_client));
        }

        [HttpPatch("verify/{id}")]
        public async Task<IActionResult> VerifyContent(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                return BadRequest("Invalid ID provided");
            }

            try
            {
                var updateResult = await client
                    .From<NewsArticle>()
                    .Where(x => x.Id == id)
                    .Set(x => x.IsVerified, true)
                    .Set(x => x.IsRejected,false)
                    .Update();
                if(updateResult == null)
                {
                    return NotFound($"News with id = {id} was not found");
                }

                return Ok(new { message = "Content verified successfully" });
            }
            catch (Exception ex)
            {
             
                Console.WriteLine($"Error occurred while verifying content with id = {id}: {ex}");
                return StatusCode(StatusCodes.Status500InternalServerError,
                    $"Error occurred while verifying content with id = {id}");
            }
        }

        [HttpPatch("reject/{id}")]
        public async Task<IActionResult> RejectContent(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                return BadRequest("Invalid ID provided");
            }

            try
            {
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

                return Ok(new { message = "Content rejected successfully" });
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
