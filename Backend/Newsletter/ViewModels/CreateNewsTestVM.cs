namespace Newsletter.ViewModels
{
    public class CreateNewsTestVM
    {
        public string Title { get; set; }
        public string EditorContent { get; set; }

        public IFormFile CoverImage { get; set; }

        public List<IFormFile> Images { get; set; }
        public List<string> ImageNames { get; set; }

    }
}
