using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newsletter.Models;
using Newsletter.ViewModels;

namespace Newsletter.Controllers
{
    [Route("api/category")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly Supabase.Client client;

        public CategoryController(Supabase.Client _client) 
        {
            client = _client ?? throw new ArgumentNullException(nameof(_client));
        }

        [HttpPost]
        public async Task<IActionResult> CreateCategory(CreateCategoryVM category)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                if (category == null) return BadRequest("category data is null");
                var newCategory = new Category { 
                    CategoryName = category.CategoryName,
                };
                var response = await client.From<Category>().Insert(newCategory);
                var createdCategory = response.Models.First();
                Console.WriteLine($"Category created with id = {createdCategory.CategoryId}");
                return Ok(createdCategory.CategoryId);

            }
            catch (Exception ex)
            {

                Console.WriteLine($"Error creating user: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");

                return StatusCode(StatusCodes.Status500InternalServerError, "Error creating Category");
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetCategories()
        {
            try
            {
                var response = await client.From<Category>().Get();
                if(response?.Models == null || !response.Models.Any())
                {
                    return NotFound("Categories not found");
                }
                var categories = response.Models;
                var result = new List<object>();
                foreach (var category in categories)
                {
                    result.Add( new
                    {
                        category.CategoryId,
                        category.CategoryName,
                    });
                }
                return Ok(result);
            }
            catch (Exception ex)
            {

                Console.WriteLine($"Error creating user: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");

                return StatusCode(StatusCodes.Status500InternalServerError, "Error getting all Category");
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCategoryById(string id)
        {
            try
            {
                var response = await client.From<Category>().Where(c => c.CategoryId == id).Get();
                var category = response.Models.First();
                if(category == null)
                {
                    return NotFound($"Category with id = {id} was not found");
                }

                var result = new GetCategoryVM 
                { 
                    CategoryId = category.CategoryId,
                    CategoryName = category.CategoryName,
                };
                return Ok(result);

            }
            catch (Exception ex)
            {

                Console.WriteLine($"Error creating user: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");

                return StatusCode(StatusCodes.Status500InternalServerError, $"Error getting Category with id = {id}");
            }
        }

        [HttpPatch("{id}")]
        public async Task<IActionResult> UpdateCategory(string id, GetCategoryVM category)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                var existingCategory = await client.From<Category>().Where(c => c.CategoryId == id).Get();
                if (!existingCategory.Models.Any())  return NotFound($"Category with id = {id} was not found");
                var updateCategory = existingCategory.Models.First();
                if(!string.IsNullOrEmpty(category.CategoryName)) { updateCategory.CategoryName = category.CategoryName; }
                await client.From<Category>().Update(updateCategory);
                return Ok("Category Updated Successfully");
            }
            catch (Exception ex)
            {

                Console.WriteLine($"Error creating user: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");

                return StatusCode(StatusCodes.Status500InternalServerError, $"Error upadating Category with id = {id}");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategory(string id)
        {
            try
            {
                var response = await client.From<Category>().Where(c => c.CategoryId == id).Get();
                if (response.Models.Count == 0) return NotFound($"Category with id = {id} was not found");
                await client.From<Category>().Where(c => c.CategoryId == id).Delete();
                return NoContent();
            }
            catch (Exception ex)
            {

                Console.WriteLine($"Error creating user: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");

                return StatusCode(StatusCodes.Status500InternalServerError, $"Error Deleting Category with id = {id}");
            }
        }
    }
}
