using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;


namespace Newsletter.Models
{
    [Table("Notifications")]
    public class Notifications : BaseModel
    {
        [PrimaryKey("notification_id", false)]
        public string NotificationId { get; set; }
        [Column("sender_id")]
        public string SenderId { get; set; }
        [Column("reciever_id")]
        public string RecieverId { get; set; }
        [Column("message")]
        public string Message { get; set; }
        [Column("is_read")]
        public bool IsRead { get; set; }
        [Column("notification_type")]
        public string NotificationType { get; set; }
        [Column("created_at")]
        public DateTime CreatedAt { get; set; }
    }
}
