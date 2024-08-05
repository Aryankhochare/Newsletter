using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newsletter.Models;
using Newsletter.ViewModels;

namespace Newsletter.Controllers
{
    [Route("admin")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly Supabase.Client _client;

        public AdminController(Supabase.Client client)
        {
            _client = client ?? throw new ArgumentNullException(nameof(client));
        }

        [HttpPatch("{id}")]
        public async Task<IActionResult> UpdateUser(string id, UpdateUserAdminVM user)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                var existingUser = await _client.From<Users>().Where(u => u.Id == id).Get();
                if (!existingUser.Models.Any())
                {
                    return NotFound($"User with id = {id} was not found");
                }
                var updateUser = existingUser.Models.First();

                if (!string.IsNullOrEmpty(user.Username)) updateUser.Username = user.Username;
                if (!string.IsNullOrEmpty(user.Password)) updateUser.Password = user.Password;
                if (!string.IsNullOrEmpty(user.Email)) updateUser.Email = user.Email;
                updateUser.ModifiedDate = DateTime.UtcNow;
                await _client.From<Users>().Update(updateUser);

                if(user.UserRoles!=null) 
                {
                    var existingUserRole = await _client.From<UserUserRoles>().Where(uur => uur.UserId == id).Get();
                    var existingRoleIds = existingUserRole.Models.Select(r => r.UserRoleId).ToHashSet();
                    var roleToAdd = user.UserRoles.Where(r => !existingRoleIds.Contains(r)).ToList();
                    var roleToRemove = existingRoleIds.Where(r => !user.UserRoles.Contains(r)).ToList();

                    foreach (var roleId in roleToAdd)
                    {
                        var newUur = new UserUserRoles
                        {
                            UserId = id,
                            UserRoleId = roleId,
                        };
                        await _client.From<UserUserRoles>().Insert(newUur);
                    }

                    foreach (var roleId in roleToRemove)
                    {
                        if(roleId != 4)
                        {
                            await _client.From<UserUserRoles>()
                                .Where(uur => uur.UserId == id && uur.UserRoleId == roleId)
                                .Delete();
                        }
                    }
                }

                return Ok("User Update Successful.");
            }
            catch (Exception)
            {

                return StatusCode(StatusCodes.Status500InternalServerError, "Error Updating user data");
            }
        }

    }
}
