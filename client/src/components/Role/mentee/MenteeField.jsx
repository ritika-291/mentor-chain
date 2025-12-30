import InputField from "../../LoginCom/InputField";

export default function MenteeFields({ formData, handleChange }) {
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
        label="Current Role / Student"
        type="text"
        name="currentRole"
        value={formData.currentRole}
        onChange={handleChange}
      />
      <InputField
        label="Field of Interest"
        type="text"
        name="interest"
        value={formData.interest}
        onChange={handleChange}
      />
      <InputField
        label="Learning Goals (comma separated)"
        type="text"
        name="goals"
        value={formData.goals}
        onChange={handleChange}
      />
    </>
  );
}
