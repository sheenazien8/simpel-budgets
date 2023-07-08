import React from "react";
import { Formik } from "formik";
import { MMonth, RMonth } from "@/models";
import { Button, Dropdown, Select, Text } from "@/ui";
import { TrashIcon } from "@heroicons/react/24/outline";

interface IFormData {
  onSubmit: (args: RMonth) => void;
  errors?: RMonth;
  onDelete: () => void;
  onUpdateStatus: () => void;
  initialValues?: MMonth;
  loadingSubmit: boolean;
  loadingDelete: boolean;
  loadingActivate: boolean;
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
        <form
          className="space-y-4"
          onSubmit={formik.handleSubmit}
          autoComplete="off"
        >
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
          <div className="flex gap-x-2">
            <Button type="submit" block loading={props.loadingSubmit}>
              Simpan
            </Button>
            {props.initialValues?.id && (
              <>
                <Button
                  type="button"
                  color="danger"
                  loading={props.loadingDelete}
                  onClick={props.onDelete}
                >
                  <TrashIcon className="w-5 h-5" />
                </Button>
                {/* <Button
                  type="button"
                  loading={props.loadingActivate}
                  className={classNames(
                    Number(props.initialValues?.status) == 1
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-green-600 hover:bg-green-600",
                  )}
                  onClick={props.onUpdateStatus}
                >
                  {!(Number(props.initialValues?.status) == 0)
                    ? "Deactivate"
                    : "Activate"}
                </Button> */}
              </>
            )}
          </div>
        </form>
      )}
    </Formik>
  );
};

export default FormData;
