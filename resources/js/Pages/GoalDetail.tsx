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
  toastProgress,
  useHashRouteToggle,
} from "../utils/helper";
import { EmptyState } from "../Components/EmptyState";
import FormData from "./../Components/GoalDetail/FormData";
import {
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";

interface IGoalDetail {
    goal: MGoal
}

const GoalDetail = (props: IGoalDetail) => {
  const { get, create, detail, update, destroy } = useGoalDetailAction();
  const [goalDetails, setGoalDetails] = useState<MGoal>();
  const [updated, setUpdated] = useState<boolean>(false);
  const [errors, setErrors] = useState<RGoalDetail>();
  const [isOpen, toggleActive] = useHashRouteToggle("#opened-modal");
  const [loading, setLoading] = useState<boolean>(false);
  const onSubmit = async (values: RGoalDetail) => {
    // let progress: any;
    // if (!editData?.id) {
    //   progress = create(values, setErrors);
    // } else {
    //   progress = update(editData.id, values, setErrors);
    // }
    // toastProgress(
    //   progress,
    //   `${editData?.id ? "Perubahan" : "Pembuatan"} tujuan`,
    //   () => {
    //     toggleActive(false);
    //     setUpdated(!updated);
    //     setEditData(undefined);
    //   },
    // );
  };

  const onDelete = async () => {
    // if (editData?.id != undefined) {
    //   toastProgress(destroy(editData?.id), "Menghapus tujuan", () => {
    //     toggleActive(false);
    //     setUpdated(!updated);
    //     setEditData(undefined);
    //   });
    // }
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

  const Results = (
    <>
      {/* {goalDetails?.length == 0 && ( */}
      {/*   <EmptyState */}
      {/*     title="Data tujuan kosong" */}
      {/*     description="Rencanakan anggaran tujuan anda di tujuan tertentu" */}
      {/*     button={ */}
      {/*       <button */}
      {/*         type="button" */}
      {/*         className="inline-flex items-center rounded-lg border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" */}
      {/*         value="Tambah" */}
      {/*         onClick={() => { */}
      {/*           toggleActive(true); */}
      {/*           setEditData(undefined); */}
      {/*         }} */}
      {/*       > */}
      {/*         <PlusIcon className="h-5" /> Tambah Tujuan */}
      {/*       </button> */}
      {/*     } */}
      {/*   /> */}
      {/* )} */}
      {/* {goalDetails?.map((goalDetail, index) => ( */}
      {/*   <CardList */}
      {/*     bgColor="" */}
      {/*     key={index} */}
      {/*     title="" */}
      {/*     icon={<XCircleIcon className="w-6" />} */}
      {/*     details={[]} */}
      {/*     onClick={async () => { */}
      {/*       const goalDetailData = await detail(goalDetail.id); */}
      {/*       toggleActive(true); */}
      {/*       setEditData(goalDetailData.data.data); */}
      {/*       setErrors(undefined); */}
      {/*     }} */}
      {/*   /> */}
      {/* ))} */}
    </>
  );

  return (
    <Layout
      title={
        <span className="text-xl font-semibold">
          Detail tujuan untuk {goalDetails?.title}
        </span>
      }
    >
      <>
        <div>
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-medium text-gray-500"></h2>
            <button
              type="button"
              className="inline-flex items-center rounded-lg border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              value="Tambah"
              onClick={() => {
                toggleActive(true);
                // setEditData(undefined);
              }}
            >
              <PlusIcon className="h-5" />
            </button>
          </div>
          <ul
            role="list"
            className="mt-3 grid grid-cols-1 content-start gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 h-[550px] overflow-x-scroll"
          >
            {!loading ? (
              Results
            ) : (
              <h2 className="text-center my-auto">Loading...</h2>
            )}
          </ul>
        </div>
        <Modal
          open={isOpen}
          setOpen={(status) => {
            toggleActive(status);
            // setEditData(undefined);
            setErrors(undefined);
          }}
          title={
            false ? (
              <div className="flex justify-between">
                <p>Ubah tujuan</p>
              </div>
            ) : (
              "Tambah Tujuan"
            )
          }
        >
          <FormData
            onSubmit={onSubmit}
            onDelete={onDelete}
            onUpdateStatus={onUpdateStatus}
            errors={errors}
            //initialValues={editData}
          />
        </Modal>
      </>
    </Layout>
  );
};

export default GoalDetail;
