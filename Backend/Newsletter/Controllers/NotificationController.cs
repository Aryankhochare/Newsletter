using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newsletter.Models;
using Newsletter.ViewModels;

namespace Newsletter.Controllers
{
    [Route("api/notification")]
    [ApiController]
    public class NotificationController : ControllerBase
    {
        private readonly Supabase.Client client;

        public NotificationController(Supabase.Client _client)
        {
            client = _client ?? throw new ArgumentNullException(nameof(_client));
        }

        [HttpGet]
        public async Task<IActionResult> GetNotif()
        {
            try
            {
                var response = await client.From<Notifications>().Get();
                if(response.Models==null || !response.Models.Any())
                {
                    return NotFound("No notifications found");
                }
                var notifications = response.Models;
                var result = new List<object>();
                foreach(var notification in notifications)
                {
                    result.Add(new
                    {
                        notification.NotificationId,
                        notification.SenderId,
                        notification.RecieverId,
                        notification.Message,
                        notification.IsRead,
                        notification.NotificationType,
                        notification.CreatedAt
                    });
                }
                return Ok(result);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error creating user: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");

                return StatusCode(StatusCodes.Status500InternalServerError, "Error getting all Notifications");
            }
        }
        [HttpGet("{reciever_id}")]
        public async Task<IActionResult> GetNotifFromSender(string reciever_id)
        {
            try
            {
                var response = await client.From<Notifications>().Where(x => x.RecieverId == reciever_id && x.IsRead == false).Get();
                if (response.Models == null || !response.Models.Any())
                {
                    return NotFound("No notifications found");
                }
                var notifications = response.Models;
                var result = new List<object>();
                foreach (var notification in notifications)
                {
                    result.Add(new
                    {
                        notification.NotificationId,
                        notification.SenderId,
                        notification.RecieverId,
                        notification.Message,
                        notification.IsRead,
                        notification.NotificationType,
                        notification.CreatedAt
                    });
                }
                return Ok(result);

            }
            catch (Exception ex)
            {

                Console.WriteLine($"Error creating user: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");

                return StatusCode(StatusCodes.Status500InternalServerError, "Error getting Notifications");
            }
        }

        [HttpPatch("{notif_id}")]
        public async Task<IActionResult> MarkAsRead(string notif_id)
        {
            try
            {
                var response = await client.From<Notifications>()
                    .Where(x => x.NotificationId == notif_id)
                    .Set(x => x.IsRead, true).Update();
                
                if(response.Models == null || !response.Models.Any())
                {
                    return BadRequest($"Notif with id = {notif_id} could not be updated");
                }
                return Ok("Notification Updated Successfully");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error creating user: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");

                return StatusCode(StatusCodes.Status500InternalServerError, "Error updating Notification");
            }
        }
    }
}
