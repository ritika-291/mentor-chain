import InputField from "../../LoginCom/InputField";

export default function MentorFields({ formData, handleChange }) {
  return (
    <>
      <InputField
        label="Full Name"
        type="text"
        name="fullName"
        value={formData.fullName}
        onChange={handleChange}
      />
      <InputField
        label="Expertise (e.g., React, Design)"
        type="text"
        name="expertise"
        value={formData.expertise}
        onChange={handleChange}
      />
      <InputField
        label="Years of Experience"
        type="number"
        name="experience"
        value={formData.experience}
        onChange={handleChange}
      />
      <InputField
        label="LinkedIn / Portfolio URL"
        type="url"
        name="portfolio"
        value={formData.portfolio}
        onChange={handleChange}
      />
      <InputField
        label="Short Bio"
        type="textarea"
        name="bio"
        value={formData.bio}
        onChange={handleChange}
      />
    </>
  );
}
