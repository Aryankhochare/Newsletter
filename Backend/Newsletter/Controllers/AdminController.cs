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

        [HttpPatch("users/{id}")]
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

        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers()
        {
            try
            {
                var response = await _client
                    .From<Users>()
                    .Get();
                if (response?.Models == null || !response.Models.Any())
                {
                    return NotFound("No users found");
                }
                var users = response.Models;

                var userRolesResponse = await _client.From<UserUserRoles>().Get();

                var userRoles = userRolesResponse.Models ?? new List<UserUserRoles>();

                var rolesResponse = await _client.From<UserRoles>().Get();

                var roles = rolesResponse.Models ?? new List<UserRoles>();

                var result = new List<object>();

                foreach (var user in users)
                {
                    var userRoleIds = userRoles
                        .Where(ur => ur.UserId == user.Id)
                        .Select(ur => ur.UserRoleId);

                    var userRoleNames = roles
                        .Where(r => userRoleIds.Contains(r.UserRoleId))
                        .Select(r => r.UserRoleName)
                        .ToList();

                    result.Add(new
                    {
                        user.Id,
                        user.Username,
                        user.Email,
                        user.isActive,
                        user.Status,
                        userRoleNames,
                        user.CreatedDate,
                        user.ModifiedDate,
                    });
                }
                return Ok(result);

            }
            catch (Exception)
            {

                return StatusCode(StatusCodes.Status500InternalServerError, "Could not retrieve data from database");
            }
        }


        [HttpGet("users/{id}")]
        public async Task<IActionResult> GetUser(string id)
        {
            try
            {
                var response = await _client
                    .From<Users>()
                    .Where(u => u.Id == id)
                    .Get();
                var user = response.Models.FirstOrDefault();
                if (user == null) return NotFound($"User with id = {id} not found.");

                Console.WriteLine($"User found: Id = {user.Id}, Username = {user.Username}");

                var userRolesResponse = await _client
                    .From<UserUserRoles>()
                    .Where(uur => uur.UserId == id)
                    .Get();

                if (userRolesResponse?.Models == null)
                {
                    Console.WriteLine("UserUserRoles response or its Models is null");
                    return StatusCode(StatusCodes.Status500InternalServerError, "Error fetching user roles");
                }

                var userRoleIds = userRolesResponse.Models.Select(uur => uur.UserRoleId).ToList();
                Console.WriteLine($"User role IDs found: {string.Join(", ", userRoleIds)}");

                var roleResponse = await _client
                    .From<UserRoles>()
                    .Filter("user_role_id", Supabase.Postgrest.Constants.Operator.In, userRoleIds)
                    .Get();

                if (roleResponse?.Models == null)
                {
                    Console.WriteLine("UserRoles response or its Models is null");
                    return StatusCode(StatusCodes.Status500InternalServerError, "Error fetching role names");
                }

                var roleNames = roleResponse.Models.Select(ur => ur.UserRoleName).ToList();
                Console.WriteLine($"Role names found: {string.Join(", ", roleNames)}");

                var showUser = new GetUserVM
                {
                    Id = user.Id,
                    Username = user.Username,
                    Email = user.Email,
                    isActive = user.isActive,
                    Status = user.Status,
                    UserRole = roleNames,
                    CreatedDate = user.CreatedDate,
                    ModifiedDate = user.ModifiedDate,
                };

                return Ok(showUser);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetUser: {ex.Message}");
                Console.WriteLine($"Stack Trace: {ex.StackTrace}");
                return StatusCode(StatusCodes.Status500InternalServerError, "Could not retrieve data from database");
            }
        }



        [HttpDelete("users/{id}")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            try
            {
                var checkUser = await _client.From<Users>().Where(u => u.Id == id).Get();

                if (checkUser.Models.Count == 0) return NotFound($"user with id = {id} not found");

                await _client
                    .From<Users>()
                    .Where(u => u.Id == id)
                    .Delete();

                return NoContent();

            }
            catch (Exception)
            {

                return StatusCode(StatusCodes.Status500InternalServerError, $"error occured while deleting user with id = {id}");
            }
        }

    }
}
