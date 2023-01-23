import React from "react";
import { Formik } from "formik";
import { MMonth, RMonth } from "../../models";
import { classNames } from "../../utils/helper";
import Select from "../Input/Select";
import Text from "../Input/Text";

interface IFormData {
  onSubmit: (args: RMonth) => void;
  errors?: RMonth;
  onDelete: () => void;
  onUpdateStatus: () => void;
  initialValues?: MMonth;
}

const FormData = (props: IFormData) => {
  const months = [
    { value: "", label: "Pilih Bulan" },
    { value: "Januari", label: "Januari" },
    { value: "Februari", label: "Februari" },
    { value: "Maret", label: "Maret" },
    { value: "April", label: "April" },
    { value: "Mei", label: "Mei" },
    { value: "Juni", label: "Juni" },
    { value: "Juli", label: "Juli" },
    { value: "Agustus", label: "Agustus" },
    { value: "September", label: "September" },
    { value: "Oktober", label: "Oktober" },
    { value: "November", label: "November" },
    { value: "Desember", label: "Desember" },
  ];

  return (
    <Formik
      initialValues={{
        name: props.initialValues?.name ?? "",
        year: props.initialValues?.year ?? "",
      }}
      onSubmit={props.onSubmit}
    >
      {(formik) => (
        <form className="space-y-4" onSubmit={formik.handleSubmit}>
          <Select
          value={formik.values.name}
            options={months}
            label={"Bulan"}
            formik={formik}
            errors={props.errors?.name}
            name={"name"}
          />
          <Text
          value={formik.values.year}
            name={"year"}
            label={"Tahun"}
            formik={formik}
            errors={props.errors?.year ?? ""}
          />
          <div>
            <button
              type="submit"
              className="mt-2 inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
            >
              Simpan
            </button>
            {props.initialValues?.id && (
              <>
                <button
                  type="button"
                  className="mt-2 inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:text-sm"
                  onClick={props.onDelete}
                >
                  Hapus
                </button>
                <button
                  type="button"
                  className={classNames(
                    Number(props.initialValues?.status) == 1
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-green-600 hover:bg-green-600",
                    "mt-2 inline-flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-base font-medium text-white shadow-sm  focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:text-sm",
                  )}
                  onClick={props.onUpdateStatus}
                >
                  {!(Number(props.initialValues?.status) == 0)
                    ? "Deactivate"
                    : "Activate"}
                </button>
              </>
            )}
          </div>
        </form>
      )}
    </Formik>
  );
};

export default FormData;
