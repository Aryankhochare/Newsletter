    using Supabase.Postgrest.Attributes;
    using Supabase.Postgrest.Models;
    namespace Newsletter.Models
    {
        [Table("Comments")]
        public class Comments : BaseModel
        {
            [PrimaryKey("comment_id", false)]
            public string CommentId { get; set; }
            [Column("user_id")]
            public string UserId { get; set; }
            [Column("news_id")]
            public string NewsId { get; set; }
            [Column("comment")]
            public string Comment { get; set; }
            [Column("posted_on")]
             public DateTime PostedOn { get; set; }
        }
    }
