import axios from "axios";
import { API_BASE_URL, API_ENDPOINTS } from "../api/apiConfig";

export const signupUser = async ({
  first_name,
  last_name,
  email,
  password,
  phone_number,
  profile_photo,
}: {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone_number: string;
  profile_photo?: any;
}) => {
  const formData = new FormData();

  formData.append("first_name", first_name);
  formData.append("last_name", last_name);
  formData.append("email", email);
  formData.append("password", password);
  formData.append("phone_number", phone_number);

  if (profile_photo && profile_photo.uri) {
    const uriParts = profile_photo.uri.split(".");
    const fileType = uriParts[uriParts.length - 1];
    formData.append("profile_photo", {
      uri: profile_photo.uri,
      name: `profile.${fileType}`,
      type: `image/${fileType}`,
    } as any);
  }

  const response = await axios.post(
    `${API_BASE_URL}${API_ENDPOINTS.signup}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};
