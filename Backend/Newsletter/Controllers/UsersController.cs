using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newsletter.Models;
using Newsletter.ViewModels;
using System.Data.Common;

namespace Newsletter.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly Supabase.Client _client;
        
        public UsersController(Supabase.Client client)
        {
            _client = client ?? throw new ArgumentNullException(nameof(client));
        }

        [HttpPost]
        public async Task<IActionResult> CreateUser(CreateUserVM user)
        {
            try
            {
                List<UserCategory> userCategories = new List<UserCategory>();
                List<UserUserRoles> userUserRoles= new List<UserUserRoles>();

                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                if(user == null) return BadRequest("user data is null");

                var existingUserResponse = await _client
                     .From<Users>()
                     .Where(u => u.Email == user.Email)
                     .Get();

                if (existingUserResponse.Models.Any())
                {
                    return Conflict("A user with this email already exists.");
                }

                var newUser = new Users
                {
                    Username = user.Username,
                    Password = user.Password,
                    Email = user.Email,
                    isActive = true,
                    Status = "Active",
                    CreatedDate = DateTime.UtcNow,
                    ModifiedDate = DateTime.UtcNow,
                };
                var response = await _client.From<Users>().Insert(newUser);
                var createdUser = response.Models.First();
                Console.WriteLine($"User created with id = {createdUser.Id}");

                if (user.UserRoles == null || !user.UserRoles.Any())
                {
                    user.UserRoles = new List<int> { 4 };
                }

                foreach (var roleId in user.UserRoles)
                {
                    Console.WriteLine($"Processing roleID = {roleId}");

                    var res = await _client
                        .From<UserRoles>()
                        .Where(u => u.UserRoleId == roleId)
                        .Get();

                    Console.WriteLine($"User roles query result count: {res.Models.Count()}");

                    var role = res.Models.FirstOrDefault();
                    if (role == null)
                    {
                        return NotFound("Role not found");
                    }
                    var newUur = new UserUserRoles
                    {
                        UserId = createdUser.Id,
                        UserRoleId = roleId,
                    };

                    userUserRoles.Add(newUur);
                }

                var userRoleResponse = await _client.From<UserUserRoles>().Insert(userUserRoles);

                Console.WriteLine($"UserUserRole insert response model count: {userRoleResponse.Models.Count()}");
                if (!userRoleResponse.Models.Any())
                {
                    return BadRequest("Could not update UUR table");
                }

                if (user.Categories != null || user.Categories.Any())
                {
                   foreach(var categoryName in user.Categories)
                    {
                        var categoryRes = await _client.From<Category>()
                            .Where(c => c.CategoryName == categoryName)
                            .Get();
                        var category = categoryRes.Models.FirstOrDefault();
                        if(category == null)
                        {
                            return NotFound($"Category with Name {categoryName} was not found");
                        }
                        var newUserCategory = new UserCategory
                        {
                            UserId = createdUser.Id,
                            CategoryId = category.CategoryId,
                        };

                        userCategories.Add(newUserCategory);
                      
                    }
                    var userCategoryResponse = await _client.From<UserCategory>().Insert(userCategories);
                    if (!userCategoryResponse.Models.Any())
                    {
                        return BadRequest("Could not Update User Category table");
                    }

                }


                return Ok(new { createdUser.Id });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error creating user: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");

                return StatusCode(StatusCodes.Status500InternalServerError, "Error creating user");
            }
        }

        [HttpGet("{id}")]
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

                var userCategoryResponse = await _client.From<UserCategory>()
                    .Where(c => c.UserId == id)
                    .Get();
                if(userCategoryResponse?.Models == null)
                {
                    Console.WriteLine("UserUserRoles response or its Models is null");
                    return StatusCode(StatusCodes.Status500InternalServerError, "Error fetching user categories");
                }

                var userCategoryId = userCategoryResponse.Models.Select(c => c.CategoryId).ToList();
                var categoryResponse = await _client.From<Category>()
                    .Filter("category_id", Supabase.Postgrest.Constants.Operator.In, userCategoryId)
                    .Get();

                if(categoryResponse?.Models == null)
                {
                    return StatusCode(StatusCodes.Status500InternalServerError, "Error fetching category names");
                }

                var categoryNames = categoryResponse.Models.Select(c => c.CategoryName).ToList();

                var showUser = new GetUserVM
                {
                    Id = user.Id,
                    Username = user.Username,
                    Email = user.Email,
                    isActive = user.isActive,
                    Status = user.Status,
                    UserRole = roleNames,
                    Category = categoryNames,
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

        [HttpGet("email/{email}")]
        public async Task<IActionResult> GetUserByEmail(string email)
        {
            try
            {
                var response = await _client
                    .From<Users>()
                    .Where(u => u.Email == email)
                    .Get();
                var user = response.Models.FirstOrDefault();
                if (user == null) return NotFound($"User with id = {email} not found.");

                Console.WriteLine($"User found: Id = {user.Id}, Username = {user.Username}");

                var userRolesResponse = await _client
                    .From<UserUserRoles>()
                    .Where(uur => uur.UserId == user.Id)
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

                var userCategoryResponse = await _client.From<UserCategory>()
                    .Where(c => c.UserId == user.Id)
                    .Get();
                if (userCategoryResponse?.Models == null)
                {
                    Console.WriteLine("UserUserRoles response or its Models is null");
                    return StatusCode(StatusCodes.Status500InternalServerError, "Error fetching user categories");
                }

                var userCategoryId = userCategoryResponse.Models.Select(c => c.CategoryId).ToList();
                var categoryResponse = await _client.From<Category>()
                    .Filter("category_id", Supabase.Postgrest.Constants.Operator.In, userCategoryId)
                    .Get();

                if (categoryResponse?.Models == null)
                {
                    return StatusCode(StatusCodes.Status500InternalServerError, "Error fetching category names");
                }

                var categoryNames = categoryResponse.Models.Select(c => c.CategoryName).ToList();

                var showUser = new GetUserVM
                {
                    Id = user.Id,
                    Username = user.Username,
                    Email = user.Email,
                    isActive = user.isActive,
                    Status = user.Status,
                    UserRole = roleNames,
                    Category = categoryNames,
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


            [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            try
            {
                var checkUser = await _client.From<Users>().Where(u => u.Id == id).Get();

                if (checkUser.Models.Count == 0) return NotFound($"user with id = {id} not found");

                await _client.From<NewsArticle>().
                    Where(c => c.UserId == id)
                    .Delete();

                await _client.From<UserUserRoles>()
                    .Where(uur => uur.UserId == id)
                    .Delete();

                await _client.From<UserCategory>()
                    .Where(c => c.UserId == id)
                    .Delete();

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
        [HttpPatch("{id}")]
        public async Task<IActionResult> UpdateUser(string id,UpdateUserVM user)
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

                if(!string.IsNullOrEmpty(user.Username)) updateUser.Username = user.Username;
                if(!string.IsNullOrEmpty(user.Password)) updateUser.Password = user.Password;
                if (!string.IsNullOrEmpty(user.Email)) updateUser.Email = user.Email;
                updateUser.ModifiedDate = DateTime.UtcNow;
                await _client.From<Users>().Update(updateUser);
                return Ok("User Update Successful.");
            }
            catch (Exception)
            {

                return StatusCode(StatusCodes.Status500InternalServerError, "Error Updating user data");
            }
        }
    }
}
