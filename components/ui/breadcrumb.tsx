"use client"

import * as React from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  /** 
   * The visual separator between breadcrumb items 
   * @default <ChevronRight className="h-4 w-4 text-[#8D9192]" />
   */
  separator?: React.ReactNode
  /** The breadcrumb items */
  children: React.ReactNode
}

export function Breadcrumb({
  separator = <ChevronRight className="h-4 w-4 text-[#8D9192]" />,
  children,
  className,
  ...props
}: BreadcrumbProps) {
  const childrenArray = React.Children.toArray(children)
  const childrenWithSeparators = childrenArray.map((child, index) => {
    if (index === childrenArray.length - 1) {
      return child
    }

    return (
      <React.Fragment key={index}>
        {child}
        <li className="mx-2 flex items-center">{separator}</li>
      </React.Fragment>
    )
  })

  return (
    <nav aria-label="Breadcrumb" {...props}>
      <ol className={cn("flex items-center flex-wrap", className)}>
        {childrenWithSeparators}
      </ol>
    </nav>
  )
}

export interface BreadcrumbItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
  /** Whether this item represents the current page */
  isCurrentPage?: boolean
}

export function BreadcrumbItem({
  children,
  className,
  isCurrentPage,
  ...props
}: BreadcrumbItemProps) {
  return (
    <li
      className={cn("flex items-center text-sm", className)}
      aria-current={isCurrentPage ? "page" : undefined}
      {...props}
    >
      {children}
    </li>
  )
}

export interface BreadcrumbLinkProps extends React.HTMLAttributes<HTMLAnchorElement> {
  /** Link's href attribute */
  href?: string
  /** Link's children */
  children: React.ReactNode
  /** Whether to use an anchor element even if href is provided */
  asChild?: boolean
}

export function BreadcrumbLink({
  className,
  href,
  children,
  asChild = false,
  ...props
}: BreadcrumbLinkProps) {
  const Component = href && !asChild ? Link : "span"
  
  return (
    <Component
      href={href as string}
      className={cn(
        "transition-colors",
        href
          ? "text-[#EDEDED] hover:text-[#28809a]"
          : "text-[#28809a] cursor-default",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  )
}

export interface BreadcrumbPageProps extends React.HTMLAttributes<HTMLSpanElement> {}

export function BreadcrumbPage({ className, ...props }: BreadcrumbPageProps) {
  return <span className={cn("text-[#28809a]", className)} aria-current="page" {...props} />
}
