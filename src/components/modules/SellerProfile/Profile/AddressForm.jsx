import axios from "axios";
import { Formik, Field, Form } from "formik";
import { toast } from "react-toastify";
import DropdownInput from "@/components/Inputs/DropdownInput";
import { useEffect, useState } from "react";
import customAxios from "../../../../utils/apis/apis";

const AddressForm = ({ user, countries, cities, fetchCities, fetchData }) => {
  const [toggleCity, setToggleCity] = useState(false);
  const [toggleCountry, setToggleCountry] = useState(false);
  const [searchQueryCity, setSearchQueryCity] = useState("");
  const [searchQueryCountry, setSearchQueryCountry] = useState("");

  useEffect(() => {
    fetchCities(user?.financialInfo?.country);
  }, []);
  return (
    <div className="sm:px-8 px-4 pb-3 sm:py-6">
      <h2 className="sm:text-lg text-base lg:text-xl font-medium text-white mb-4">
        Address Details
      </h2>
      <Formik
        initialValues={{
          address: user?.professionalBackground?.address || "",
          city: user?.professionalBackground?.city || "",
          state: user?.professionalBackground?.state || "",
          postCode: user?.professionalBackground?.postCode || "",
          country: user?.professionalBackground?.country || "",
        }}
        enableReinitialize
        onSubmit={async (values) => {
          try {
            const res = await customAxios.put(`/user/update/${user?.uuid}`, {
              professionalBackground: values,
            });
            if (res?.status === 200) {
              toast.success("Professional Background Updated Successfully");
              fetchData();
            }
          } catch (error) {
            console.error(error.message);
            toast.error(error?.message);
          }
        }}
      >
        {({ setFieldValue, values, isSubmitting }) => (
          <Form className="sm:grid space-y-5 sm:space-y-0 sm:grid-cols-2 w-full gap-4">
            <div>
              <Field
                type="text"
                name="address"
                placeholder="Address"
                className="shadow-neons rounded w-full h-[48px] pl-5 placeholder:text-dark-grey outline-with-opacity sm:placeholder:text-[15px] placeholder:text-xs sm:text-base text-sm placeholder:font-normal card-number-input"
              />
            </div>
            <div>
              <DropdownInput
                setToggle={setToggleCity}
                selectedValue={
                  values.city || user?.professionalBackground?.city
                }
                dropdownOptions={cities?.map((city) => city.name)}
                onChange={(value) => {
                  setFieldValue("city", value);
                  setToggleCity(false);
                }}
                placeholder="Search City"
                searchQuery={searchQueryCity}
                setSearchQuery={setSearchQueryCity}
                toggle={toggleCity}
                label="City"
              />
            </div>
            <div>
              <Field
                type="text"
                name="state"
                placeholder="State"
                className="shadow-neons rounded w-full h-[48px] pl-5 placeholder:text-dark-grey outline-with-opacity sm:placeholder:text-[15px] placeholder:text-xs sm:text-base text-sm placeholder:font-normal card-number-input"
              />
            </div>
            <div>
              <Field
                type="text"
                name="postCode"
                placeholder="Post Code"
                className="shadow-neons rounded w-full h-[48px] pl-5 placeholder:text-dark-grey outline-with-opacity sm:placeholder:text-[15px] placeholder:text-xs sm:text-base text-sm placeholder:font-normal card-number-input"
              />
            </div>
            <div>
              <DropdownInput
                setToggle={setToggleCountry}
                selectedValue={
                  values.country || user?.professionalBackground?.country
                }
                dropdownOptions={countries.map((country) => country.country)}
                onChange={(value) => {
                  setFieldValue("country", value);
                  fetchCities(value);
                  setToggleCountry(false);
                }}
                toggle={toggleCountry}
                searchQuery={searchQueryCountry}
                setSearchQuery={setSearchQueryCountry}
                label="Country"
                placeholder="Search Country"
              />
            </div>
            <div className="flex col-span-2 justify-end items-center mt-10">
              <button
                type="submit"
                disabled={isSubmitting} // Disable if the form is submitting or loading
                className={`btn-gradient px-5 rounded py-2 mt-4 ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Save
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddressForm;
