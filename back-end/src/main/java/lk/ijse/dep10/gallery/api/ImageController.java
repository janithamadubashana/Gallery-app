package lk.ijse.dep10.gallery.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import javax.servlet.ServletContext;
import javax.servlet.http.Part;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/images")
public class ImageController {
    @Autowired
    private ServletContext servletContext;

    @GetMapping
    public List<String> getAllImages(UriComponentsBuilder uriBuilder) {
        ArrayList<String> imageFileList = new ArrayList<>();
        String imgDirPath = servletContext.getRealPath("/images");
        File imgDir = new File(imgDirPath);
        String[] imageFileNames = imgDir.list();
        for (String imageFileName : imageFileNames) {
            UriComponentsBuilder cloneBuilder = uriBuilder.cloneBuilder();
            String url = cloneBuilder.
                    pathSegment("images", imageFileName).toUriString();
            imageFileList.add(url);
        }
        return imageFileList;
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ArrayList<String> saveImages(@RequestParam("images") List<Part> imageFiles, UriComponentsBuilder urlBuilder) {
        ArrayList<String> imageUrlList = new ArrayList<>();
        if (imageFiles != null) {
            String imgDirPath = servletContext.getRealPath("/images");
            for (Part imageFile : imageFiles) {
                String imageFilePath = new File(imgDirPath, imageFile.getSubmittedFileName()).getAbsolutePath();
                try {
                    System.out.println(imageFilePath);
                    imageFile.write(imageFilePath);
                    UriComponentsBuilder cloneUrlBuilder = urlBuilder.cloneBuilder();
                    String imageUrl = cloneUrlBuilder.pathSegment("images", imageFile.getSubmittedFileName()).
                            toUriString();
                    imageUrlList.add(imageUrl);
                } catch (IOException e) {
                    e.printStackTrace();
                }

            }
        }
        return imageUrlList;
    }
}
