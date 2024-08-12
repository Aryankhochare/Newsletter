﻿using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newsletter.Models;
using Newsletter.ViewModels;
using System.Data.Common;

namespace Newsletter.Controllers
{
    [Route("users")]
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
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                if(user == null) return BadRequest("user data is null");
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
                    Console.WriteLine("No user roles provided");
                    return BadRequest("No user roles provided");
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
                    var userRoleResponse = await _client.From<UserUserRoles>().Insert(newUur);
                    Console.WriteLine($"UserUserRole insert response model count: {userRoleResponse.Models.Count()}");
                    if (!userRoleResponse.Models.Any())
                    {
                        return BadRequest("Could not update UUR table");
                    }
                }

                return Ok(createdUser.Id);
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

        

        [HttpDelete("{id}")]
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
