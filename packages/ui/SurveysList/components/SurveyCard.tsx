import TemplateBG from "@/images/assets/template_bg.png";
import { Code, Link2Icon, MenuSquareIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { cn } from "@formbricks/lib/cn";
import { convertDateString, timeSince } from "@formbricks/lib/time";
import { TEnvironment } from "@formbricks/types/environment";
import { TSurvey } from "@formbricks/types/surveys";

import { SurveyStatusIndicator } from "../../SurveyStatusIndicator";
import { generateSingleUseIdAction } from "../actions";
import SurveyDropDownMenu from "./SurveyDropdownMenu";

interface SurveyCardProps {
  survey: TSurvey;
  environment: TEnvironment;
  otherEnvironment: TEnvironment;
  isViewer: boolean;
  WEBAPP_URL: string;
  orientation: string;
}
export default function SurveyCard({
  survey,
  environment,
  otherEnvironment,
  isViewer,
  WEBAPP_URL,
  orientation,
}: SurveyCardProps) {
  const isSurveyCreationDeletionDisabled = isViewer;

  const surveyStatusLabel = useMemo(() => {
    if (survey.status === "inProgress") return "Active";
    else if (survey.status === "completed") return "Completed";
    else if (survey.status === "draft") return "Draft";
    else if (survey.status === "paused") return "Paused";
  }, [survey]);

  const [singleUseId, setSingleUseId] = useState<string | undefined>();

  useEffect(() => {
    if (survey.singleUse?.enabled) {
      generateSingleUseIdAction(survey.id, survey.singleUse?.isEncrypted ? true : false).then(setSingleUseId);
    } else {
      setSingleUseId(undefined);
    }
  }, [survey]);

  const linkHref = useMemo(() => {
    return survey.status === "draft"
      ? `/environments/${environment.id}/surveys/${survey.id}/edit`
      : `/environments/${environment.id}/surveys/${survey.id}/summary`;
  }, [survey.status, survey.id, environment.id]);

  const SurveyTypeIndicator = ({ type }: { type: string }) => (
    <div className="flex items-center space-x-2 text-sm text-slate-600">
      {type === "web" ? (
        <>
          <Code className="h-4 w-4" />
          <span> In-app</span>
        </>
      ) : (
        <>
          <Link2Icon className="h-4 w-4" />
          <span> Link</span>
        </>
      )}
    </div>
  );

  function formatDate(dateString: Date) {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const date = new Date(dateString);
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    const suffix = getDaySuffix(day);

    return `${day}${suffix} ${month}, ${year}`;
  }

  function getDaySuffix(day: number) {
    if (day >= 11 && day <= 13) {
      return "th";
    }
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  }

  const renderGridContent = () => {
    return (
      <Link href={linkHref} key={survey.id}>
        {/* <div className="flex justify-between">
          <SurveyTypeIndicator type={survey.type} />
          <SurveyDropDownMenu
            survey={survey}
            key={`surveys-${survey.id}`}
            environmentId={environment.id}
            environment={environment}
            otherEnvironment={otherEnvironment!}
            webAppUrl={WEBAPP_URL}
            singleUseId={singleUseId}
            isSurveyCreationDeletionDisabled={isSurveyCreationDeletionDisabled}
          />
        </div>
        <div>
          <div className="text-md font-medium text-slate-900">{survey.name}</div>
          <div
            className={cn(
              "mt-3 flex w-fit items-center gap-2 rounded-full py-1 pl-1 pr-2 text-xs text-slate-800",
              surveyStatusLabel === "Active" && "bg-emerald-50",
              surveyStatusLabel === "Completed" && "bg-slate-200",
              surveyStatusLabel === "Draft" && "bg-slate-100",
              surveyStatusLabel === "Paused" && "bg-slate-100"
            )}>
            <SurveyStatusIndicator status={survey.status} /> {surveyStatusLabel}
          </div>
        </div> */}

        <div className="cursor-pointer rounded-lg border  p-4" key={survey.name}>
          <div className="container mx-auto mb-4 rounded-lg border bg-[#EFF6FF]">
            <Image src={TemplateBG} alt="template" className="w-[100%]" />
          </div>
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h1 className="text-[14px] font-bold text-[#343B46]">{survey.name}</h1>
              <h2 className="text-[14px] font-normal text-[#677990]">{formatDate(survey.createdAt)}</h2>
            </div>
            <button className="cursor-pointer">
              <MenuSquareIcon className="h-5 w-5 text-[#677990]" />
            </button>
          </div>
          <div>
            <p
              className={cn(
                "w-fit rounded-full border  px-4 py-[2px] text-[10px]",
                surveyStatusLabel === "Active" && "bg-emerald-50",
                surveyStatusLabel === "Completed" && "bg-[#CCF0D5]",
                surveyStatusLabel === "Draft" && "bg-[#ECEFF2]",
                surveyStatusLabel === "Paused" && "bg-slate-100"
              )}>
              {surveyStatusLabel}
            </p>
          </div>
        </div>
      </Link>
    );
  };

  const renderListContent = () => {
    return (
      <Link
        href={linkHref}
        key={survey.id}
        className="relative grid w-full grid-cols-8 place-items-center gap-3 rounded-xl border border-slate-200 bg-white p-4
    shadow-sm transition-all ease-in-out hover:scale-[101%]">
        <div className="col-span-2 flex items-center justify-self-start overflow-hidden text-ellipsis whitespace-nowrap text-sm font-medium text-slate-900">
          {survey.name}
        </div>
        <div
          className={cn(
            "flex w-fit items-center gap-2 rounded-full py-1 pl-1 pr-2 text-sm text-slate-800",
            surveyStatusLabel === "Active" && "bg-emerald-50",
            surveyStatusLabel === "Completed" && "bg-slate-200",
            surveyStatusLabel === "Draft" && "bg-slate-100",
            surveyStatusLabel === "Paused" && "bg-slate-100"
          )}>
          <SurveyStatusIndicator status={survey.status} /> {surveyStatusLabel}{" "}
        </div>
        <div className="flex justify-between">
          <SurveyTypeIndicator type={survey.type} />
        </div>

        <div className="col-span-4 grid w-full grid-cols-5 place-items-center">
          <div className="col-span-2 overflow-hidden text-ellipsis whitespace-nowrap text-sm text-slate-600">
            {convertDateString(survey.createdAt.toString())}
          </div>
          <div className="col-span-2 overflow-hidden text-ellipsis whitespace-nowrap text-sm text-slate-600">
            {timeSince(survey.updatedAt.toString())}
          </div>
          <div className="place-self-end  ">
            <SurveyDropDownMenu
              survey={survey}
              key={`surveys-${survey.id}`}
              environmentId={environment.id}
              environment={environment}
              otherEnvironment={otherEnvironment!}
              webAppUrl={WEBAPP_URL}
              singleUseId={singleUseId}
              isSurveyCreationDeletionDisabled={isSurveyCreationDeletionDisabled}
            />
          </div>
        </div>
      </Link>
    );
  };
  if (orientation === "grid") return renderGridContent();
  else return renderListContent();
}
