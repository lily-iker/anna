package vn.fruit.anna.service;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryService {

    private final Cloudinary cloudinary;

    // Injecting Cloudinary credentials from environment variables
    public CloudinaryService(
            @Value("${CLOUDINARY_CLOUD_NAME}") String cloudName,
            @Value("${CLOUDINARY_API_KEY}") String apiKey,
            @Value("${CLOUDINARY_API_SECRET}") String apiSecret
    ) {
        // Initialize Cloudinary with environment variables
        this.cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret
        ));
    }

    public String uploadImage(MultipartFile file) throws IOException {
        Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                "folder", "anna" // Specify the folder name in Cloudinary
        ));
        return (String) uploadResult.get("url");
    }

    public void deleteAsset(String publicId) throws IOException {
        // Deleting the asset using its public ID
        if (publicId == null || publicId.isEmpty()) return;
        cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
    }

    /**
     * Extracts the Cloudinary public ID from a full Cloudinary URL.
     *
     * Cloudinary URLs typically follow this format:
     *   https://res.cloudinary.com/<cloud_name>/image/upload/v<version>/<folder>/<file-name>.<extension>
     *
     * This method strips out the version and extension to return just:
     *   <folder>/<file-name>
     *
     * For example:
     *   Input:  https://res.cloudinary.com/demo/image/upload/v12345678/anna/my-image.jpg
     *   Output: anna/my-image
     *
     * @param url the full Cloudinary image URL
     * @return the public ID used by Cloudinary for asset management, or null if invalid
     */
    public String getPublicIdFromUrl(String url) {

        // Example: https://res.cloudinary.com/demo/image/upload/v12345678/anna/my-image.jpg

        // Split the URL at "/upload/" to separate the versioned path and file from the rest
        // The first part is the base URL, e.g., "https://res.cloudinary.com/demo/image"
        // The second part contains the version and the path to the image e.g., "v12345678/anna/my-image.jpg"
        String[] parts = url.split("/upload/");

        // If the URL doesn't contain "/upload/", it's not a valid Cloudinary image URL
        if (parts.length < 2) {
            return null;
        }

        // Extract the portion after "/upload/", e.g., "v12345678/anna/my-image.jpg"
        String pathAndFile = parts[1];

        // Remove the version prefix (e.g., "v12345678/") to get "anna/my-image.jpg"
        pathAndFile = pathAndFile.substring(pathAndFile.indexOf("/") + 1);

        // Strip off the file extension (e.g., ".jpg") to get "anna/my-image"
        return pathAndFile.substring(0, pathAndFile.lastIndexOf("."));
    }

}