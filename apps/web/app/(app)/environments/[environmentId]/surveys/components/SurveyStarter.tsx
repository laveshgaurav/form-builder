"use client";

import TemplateList from "@/app/(app)/environments/[environmentId]/surveys/templates/TemplateList";
import {
  customSurvey,
  synchroworkTemplate,
} from "@/app/(app)/environments/[environmentId]/surveys/templates/templates";
import { replacePresetPlaceholders } from "@/app/lib/templates";
import Background from "@/images/assets/background.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";

import type { TEnvironment } from "@formbricks/types/environment";
import type { TProduct } from "@formbricks/types/product";
import { TSurveyInput } from "@formbricks/types/surveys";
import { TTemplate } from "@formbricks/types/templates";
import { TUser } from "@formbricks/types/user";
import { Input } from "@formbricks/ui/Input";
import LoadingSpinner from "@formbricks/ui/LoadingSpinner";
import { Button } from "@formbricks/ui/v2/Button";

import { createSurveyAction } from "../actions";

export default function SurveyStarter({
  environmentId,
  environment,
  product,
  user,
}: {
  environmentId: string;
  environment: TEnvironment;
  product: TProduct;
  user: TUser;
}) {
  const [activeTemplate, setActiveTemplate] = useState<TTemplate | null>(null);
  const [isCreateSurveyLoading, setIsCreateSurveyLoading] = useState(false);
  const router = useRouter();

  const newSurveyFromTemplate = async (template: TTemplate) => {
    setIsCreateSurveyLoading(true);
    const surveyType = environment?.widgetSetupCompleted ? "web" : "link";
    const autoComplete = surveyType === "web" ? 50 : null;
    const augmentedTemplate: TSurveyInput = {
      ...template.preset,
      type: surveyType,
      autoComplete: autoComplete || undefined,
      createdBy: user.id,
    };
    try {
      const survey = await createSurveyAction(environmentId, augmentedTemplate);
      router.push(`/environments/${environmentId}/surveys/${survey.id}/edit`);
    } catch (e) {
      toast.error("An error occured creating a new survey");
      setIsCreateSurveyLoading(false);
    }
  };
  return (
    <>
      {/* <div className="mx-auto flex w-full max-w-5xl flex-col py-12">
        {isCreateSurveyLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            <div className="px-7 pb-4">
              <h1 className="text-3xl font-extrabold text-slate-700">
                You&apos;re all set! Time to create your first survey...........
              </h1>
            </div>
          </>
        )}
      </div> */}

      <div className="container flex flex-col gap-y-6 ">
        {/* header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[24px] font-semibold text-[#22272F]">My Workspace</h1>
            <p className="text-[14px] font-medium text-[#677990]">
              List of all the sheets that you’ve created
            </p>
          </div>
          <div>
            <Input placeholder="Search" className="focus:border-[#155EEF]" />
          </div>
        </div>
        {/* banner */}
        <div className="container flex items-center justify-between rounded-lg bg-[#EFF6FF] p-12">
          <div className="">
            <h1 className="mb-8 text-[32px] font-bold leading-[40px] text-[#22272F]">
              Create Forms and <br /> Get it shipping
            </h1>
            <button
              className="rounded-md bg-[#155EEF] px-6 py-2 text-white"
              onClick={() => {
                const newTemplate = replacePresetPlaceholders(customSurvey, product);
                newSurveyFromTemplate(newTemplate);
                setActiveTemplate(newTemplate);
              }}>
              Create a Blank Form
            </button>
          </div>

          <Image alt="bg" src={Background} className="w-[300px]" />
        </div>

        <h3 className="text-[18px] font-bold text-[#22272F]">Form Templates</h3>
        <h4 className="text-[16px] font-bold text-[#3A4452]">Increase Revenue</h4>

        {/* template container */}
        <TemplateList
          environmentId={environmentId}
          onTemplateClick={(template) => {
            newSurveyFromTemplate(template);
          }}
          environment={environment}
          product={product}
          user={user}
        />
      </div>
    </>
  );
}
