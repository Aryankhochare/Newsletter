using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newsletter.Models;
using Newsletter.ViewModels;
using System.Data.Common;
using System.Text.RegularExpressions;
using Supabase;
using Microsoft.AspNetCore.CookiePolicy;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.Extensions.Configuration;

namespace Newsletter.Controllers
{
    [Route("api/comments")]
    [ApiController]
    public class CommentController : ControllerBase
    {
        public readonly Supabase.Client client;
        private readonly IConfiguration configuration;
        private Dictionary<string, string> categoryCache = new Dictionary<string, string>();

        public CommentController(Client _client, IConfiguration _configuration)
        {
            client = _client ?? throw new ArgumentNullException(nameof(_client));
            configuration = _configuration ?? throw new ArgumentNullException(nameof(_configuration));
        }

        private string GetUserIdFromToken(string token) //Using the token passed from frontend in order to get userId
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
            //Console.WriteLine($"user_id : {user_id}");
            return user_id;
        }

        private async Task<string> ValidateAndGetUserId() //After geetting the ID, we validate the user !
        {
            var authHeader = Request.Headers["Authorization"].FirstOrDefault();
            if (authHeader != null && authHeader.StartsWith("Bearer "))
            {
                var token = authHeader.Substring(7);
                //Console.WriteLine($"Token: {token}");
                var decrypted_user_id = GetUserIdFromToken(token);
                //Console.WriteLine($"user id in validate : { decrypted_user_id}");
                return decrypted_user_id;
            }
            else
            {
                return null;
            }
        }

        [HttpGet]
        public async Task<IActionResult> FetchUsers()
        {
            try
            {
                var userId = await ValidateAndGetUserId();
                Console.WriteLine(userId);
                if (userId == null) return Unauthorized("User not found");
                return Ok(new { userId });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching user ID: {ex.Message}");
                return StatusCode(500, "An internal server error occurred while fetching the user.");
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateComment([FromBody] CreateCommentVM vm)
        {
            try
            {
                var userId = await ValidateAndGetUserId();
                if (userId == null) return Unauthorized("User not found");
                var newComment = new Comments { UserId = userId, NewsId = vm.NewsId, Comment = vm.Comment };
                var response = await client.From<Comments>().Insert(newComment);
                var commentResp = response.Models.FirstOrDefault();

                if (commentResp == null)
                {
                    return BadRequest("Failed to create comment");
                }

                var result = new
                {
                    userId = userId,
                    NewsId = commentResp.NewsId,
                    Comment = commentResp.Comment,

                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                // Log the exception    
                Console.WriteLine($"Error creating comment: {ex}");
                return StatusCode(500, "An error occurred while creating comment");
            }
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteComment(string id)
        {
            try
            {
                var findcomment = await client.From<Comments>().Where(c => c.CommentId == id).Get();

                if (findcomment.Models.Count == 0) return NotFound($"Comment with id = {id} was not found");

                await client.From<Comments>().Where(x => x.CommentId == id).Delete();

                //return NoContent();
                return Ok(new { message = "Comment deleted successfully" });
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error occured while deleting Comment with id = {id}");
            }
        }
    }
}
