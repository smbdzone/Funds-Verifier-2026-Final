import React from "react";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useRouter } from "next/navigation";
import customAxios from "@/utils/apis/apis";

// Validation Schema using Yup
const validationSchema = Yup.object({
  buyerAttended: Yup.boolean().required(
    "Please indicate if the buyer attended."
  ),
  sellerAttended: Yup.boolean().required(
    "Please indicate if the seller attended."
  ),
  comment: Yup.string().max(500, "Comment can't exceed 500 characters."),
});

const ConfirmationForm = ({ id }) => {
  const router = useRouter();
  const handleSubmit = async (values) => {
    try {
      const response = await customAxios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/arrange-view/trustee/update/${id}`,
        values
      );
      if (response?.data) {
        toast.success("Submitted Successfully!");
        router.replace("/trustee/viewing");
      }
    } catch (error) {
      console.log(error, "error");
    }
  };

  const customCheckboxStyle = {
    backgroundColor: "white",
    borderColor: "#002d4f",
    color: "white",
  };

  return (
    <div className="mt-10">
      <div className="primary-gradient flex items-center justify-between border border-black rounded py-3 px-4 overflow-x-auto">
        <h2 className="text-white font-semibold text-[18px]">
          Confirm Viewing
        </h2>
      </div>

      {/* Formik Form */}
      <Formik
        initialValues={{
          buyerAttended: false,
          sellerAttended: false,
          comment: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, handleChange, handleBlur, errors, touched }) => (
          <Form className="mt-10">
            <div className="flex items-center mb-4">
              <Field
                type="checkbox"
                name="buyerAttended"
                id="buyerAttended"
                className="checkbox-input"
                onChange={handleChange}
                checked={values.buyerAttended}
                style={customCheckboxStyle}
              />
              <label htmlFor="buyerAttended" className="ml-2">
                Buyer Attended
              </label>
              {errors.buyerAttended && touched.buyerAttended && (
                <div className="error-message">{errors.buyerAttended}</div>
              )}
            </div>

            <div className="flex items-center mb-4">
              <Field
                type="checkbox"
                name="sellerAttended"
                id="sellerAttended"
                className={`checkbox-input ${
                  values.sellerAttended ? "checked" : ""
                }`}
                onChange={handleChange}
                checked={values.sellerAttended}
                style={customCheckboxStyle}
              />
              <label htmlFor="sellerAttended" className="ml-2">
                Seller Attended
              </label>
              {errors.sellerAttended && touched.sellerAttended && (
                <div className="error-message">{errors.sellerAttended}</div>
              )}
            </div>

            <div className="mb-4">
              <Field
                as="textarea"
                name="comment"
                id="comment"
                placeholder="Leave a comment"
                className="input-field"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.comment}
              />
              {errors.comment && touched.comment && (
                <div className="error-message">{errors.comment}</div>
              )}
            </div>

            <button
              type="submit"
              className="submit-button"
              style={{
                background:
                  "linear-gradient(to right, #002d4f 0%, #5085ad 31%, #002d4f 64%, #5085ad 97%)",
              }}
            >
              Submit
            </button>
          </Form>
        )}
      </Formik>

      <ToastContainer />

      {/* Styles */}
      <style>{`
        .checkbox-input {
          appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  display: inline-block;
  width: 22px;
  height: 22px;
  padding: 0.25em;
  vertical-align: middle;
  background-color: transparent;
  border: 1px solid #002d4f;
  cursor: pointer;
        }
 .checkbox-input:checked {
          background-color: #002d4f;
  border-color: #002d4f;
        }
          .checkbox-input:checked::before {
  content: "";
  display: block;
  width: 12px;
  height: 12px;
  margin: auto;
  background-color: #002d4f;
  border-radius: 0;
}
        .input-field {
          width: 100%;
          padding: 10px;
          border-radius: 5px;
          border: 1px solid #ddd;
          resize: vertical;
        }

        .submit-button {
          padding: 10px 20px;
          border: none;
          color: white;
          border-radius: 5px;
          cursor: pointer;
        }

        .error-message {
          color: red;
          font-size: 12px;
        }
      `}</style>
    </div>
  );
};

export default ConfirmationForm;
