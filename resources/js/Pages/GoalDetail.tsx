import React, { useEffect, useState } from "react";
import Layout from "../Components/Layout";
import { PlusIcon } from "@heroicons/react/20/solid";
import CardList from "../Components/List";
import Modal from "../Components/Modal";
import { useGoalDetailAction } from "../actions";
import { MGoal, MGoalDetail, RGoalDetail } from "../models";
import {
  classNames,
  formatMoney,
  kFormatter,
  toastProgress,
  useHashRouteToggle,
} from "../utils/helper";
import { EmptyState } from "../Components/EmptyState";
import FormData from "./../Components/GoalDetail/FormData";
import {
  AcademicCapIcon,
  BellAlertIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  PencilIcon,
  PencilSquareIcon,
  PlusCircleIcon,
  TrashIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";
import { numify } from "numify";
import { Formik } from "formik";
import Button from "../Components/Button";
import Price from "../Components/Input/Price";

interface IGoalDetail {
  goal: MGoal;
}

const GoalDetail = (props: IGoalDetail) => {
  const { get, create, destroy } = useGoalDetailAction();
  const [goalDetails, setGoalDetails] = useState<MGoal>();
  const [updated, setUpdated] = useState<boolean>(false);
  const [errors, setErrors] = useState<RGoalDetail>();
  const [isOpen, toggleActive] = useHashRouteToggle("#opened-modal");
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);

  const onSubmit = async (values: RGoalDetail) => {
    setLoadingSubmit(true);
    toastProgress(
      create(values, props.goal.id, setErrors),
      `Penambahan nominal target berhasil`,
      () => {
        toggleActive(false);
        setUpdated(!updated);
        setLoadingSubmit(false);
      },
      () => setLoadingSubmit(false),
    );
  };

  const onDelete = async (detailId: number) => {
    toastProgress(destroy(props.goal.id, detailId), "Menghapus nominal", () => {
      toggleActive(false);
      setUpdated(!updated);
    });
  };

  const onUpdateStatus = async () => {
    /* if (editData?.id != undefined) {
      toastProgress(
        update(
          editData?.id,
          {

          },
          setErrors,
        ),
        "Perubahan status tujuan",
        () => {
          toggleActive(false);
          setUpdated(!updated);
          setEditData(undefined);
        },
      );
    } */
  };

  const load = () => {
    setLoading(true);
    get(props.goal.id).then((goalDetails) => {
      setGoalDetails(goalDetails.data.data);
      setLoading(false);
    });
    toggleActive(false);
  };

  useEffect(() => {
    load();
  }, [updated, props.goal]);

  return (
    <Layout
      title={
        <div className="grid grid-cols-3 text-xl items-center mt-14">
          <div className="flex items-center justify-center">
            <CalendarIcon
              className="h-20 w-20 text-gray-600"
              aria-hidden="true"
            />
          </div>
          <div className="col-span-2 space-y-1">
            <p className="font-normal">
              Detail tujuan untuk {goalDetails?.title}
            </p>
            <p className="font-normal text-sm text-gray-500 flex items-center">
              {formatMoney(
                Number(goalDetails?.goal_details_sum_nominal),
                false,
              )}{" "}
              / {formatMoney(Number(goalDetails?.nominal_target), false)}
              {goalDetails?.nominal_target ==
                goalDetails?.goal_details_sum_nominal && (
                <CheckCircleIcon className="ml-1 h-5 w-5 text-green-500 inline" />
              )}
            </p>
          </div>
        </div>
      }
    >
      <>
        <div className="space-y-5">
          <div className="grid grid-cols-3 bg-indigo-600 items-center py-6 text-white rounded-xl">
            <div className="grid grid-cols-1 justify-items-center items-center border-r-black">
              <p className="text-4xl">
                {goalDetails?.presentage?.toFixed(1) || 0}
                <span className="text-sm">%</span>
              </p>
            </div>
            <div className="grid grid-cols-1 justify-items-center items-center">
              <p className="text-4xl">
                {goalDetails?.less_days}
                <span className="text-sm">Hari</span>
              </p>
            </div>
            <div className="grid grid-cols-1 justify-items-center items-center">
              <p className="text-4xl">
                {numify(Number(goalDetails?.nominal_target))
                  .toString()
                  .replace(
                    numify(Number(goalDetails?.nominal_target))
                      .toString()
                      .slice(-1),
                    "",
                  )}
                <span className="text-sm">
                  {numify(Number(goalDetails?.nominal_target))
                    .toString()
                    .slice(-1)}
                </span>
              </p>
            </div>
          </div>
          <div>
            <div
              className="flex flex-start items-center py-0 cursor-pointer active:underline"
              onClick={() => toggleActive(true)}
            >
              <div className="-ml-3.5 mr-1">
                <PlusCircleIcon
                  className="h-7 w-7 text-indigo-600"
                  aria-hidden="true"
                />
              </div>
              <p className="text-gray-500 text-sm">Tambah nominal</p>
            </div>
            <ol className="border-l border-gray-300 space-y-6 h-[550px] overflow-x-scroll">
              {goalDetails?.goal_details.map((goalDetail) => (
                <li>
                  <div className="flex flex-start items-center pt-3">
                    <div className="bg-gray-300 w-2 h-2 -ml-1 mr-3 rotate-45 rounded-full"></div>
                    <p className="text-gray-500 text-sm">{goalDetail.date}</p>
                  </div>
                  <div className="ml-4 flex justify-between justify-items-center items-center h-10">
                    <h4 className="text-gray-800 font-semibold text-xl">
                      {formatMoney(goalDetail.nominal)}
                    </h4>
                    <div className="flex gap-x-1">
                      <TrashIcon
                        className="w-6 text-red-500 cursor-pointer"
                        onClick={() => onDelete(goalDetail.id)}
                      />
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
        <Modal
          open={isOpen}
          setOpen={(status) => {
            toggleActive(status);
            setErrors(undefined);
          }}
          title="Tambah nominal"
        >
          <Formik initialValues={{}} onSubmit={onSubmit}>
            {(formik) => (
              <form
                onSubmit={formik.handleSubmit}
                autoComplete="off"
                className="space-y-5"
              >
                <Price
                  label="Nominal"
                  name="nominal"
                  formik={formik}
                  value={formik.values.nominal}
                  errors={errors?.nominal}
                />
                <Button type="submit" block loading={loadingSubmit}>
                  Simpan
                </Button>
              </form>
            )}
          </Formik>
        </Modal>
      </>
    </Layout>
  );
};

export default GoalDetail;
