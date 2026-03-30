"use client";

import * as React from "react";
import NextLink from "next/link";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Progress } from "@heroui/progress";
import { Button } from "@heroui/button";

type Props = {
  title: string;
  subtitle?: string;
  progress?: number;
  href?: string;
  completed?: boolean;
};

const ChapterCard: React.FC<Props> = ({
  title,
  subtitle,
  progress = 0,
  href,
  completed = false,
}) => {
  return (
    <Card
      className={`p-3 w-full transition-all duration-300 ${completed ? "border-2 border-success/40 bg-success/5" : ""}`}
    >
      <CardHeader className="pb-1 flex items-start justify-between gap-2">
        <h3 className="text-base font-bold leading-tight">{title}</h3>
        {completed && <span className="text-success text-lg shrink-0">✅</span>}
      </CardHeader>
      <CardBody className="py-2 gap-2">
        {subtitle && <p className="text-default-700 text-xs">{subtitle}</p>}
        <Progress
          aria-label="postep"
          color={completed ? "success" : "primary"}
          size="sm"
          value={Math.max(0, Math.min(100, progress))}
        />
        <div className="text-xs text-default-700 font-medium">
          {completed ? (
            <span className="text-success font-semibold">Ukończone 🎉</span>
          ) : (
            `Postęp: ${progress}%`
          )}
        </div>
      </CardBody>
      <CardFooter className="pt-2">
        {href ? (
          <NextLink className="w-full" href={href}>
            <Button
              className="w-full font-semibold"
              color={completed ? "success" : "default"}
              size="sm"
              variant={completed ? "flat" : "ghost"}
            >
              {completed ? "Powtórz" : "Otwórz"}
            </Button>
          </NextLink>
        ) : (
          <Button className="w-full font-semibold" size="sm" variant="ghost">
            Otwórz
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ChapterCard;
