namespace Newsletter.ViewModels
{
    public class ImageUploadVM
    {
        public string image_id {  get; set; }
        public string newsletter_id   { get; set; }
        public IFormFile image_url { get; set; }
    }
}
