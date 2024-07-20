import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";

interface Props {
  links: {
    label: string;
    href?: string;
  }[];
  className?: string;
}

export const BreadCrumb = ({ links, className }: Props) => {
  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        {links.map((link, index) => {
          return (
            <React.Fragment key={index}>
              <BreadcrumbItem>
                {link.href && (
                  <BreadcrumbLink asChild>
                    <Link href={link.href}>{link.label}</Link>
                  </BreadcrumbLink>
                )}
                {!link.href && <BreadcrumbPage>{link.label}</BreadcrumbPage>}
              </BreadcrumbItem>
              {index < links.length - 1 && <BreadcrumbSeparator />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
