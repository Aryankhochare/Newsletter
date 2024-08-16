'use client'
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EyeIcon } from '@heroicons/react/24/outline';
import { MailOpenIcon, MousePointerClickIcon } from "lucide-react";
import { CartesianGrid, XAxis, Line, LineChart, Bar, BarChart } from "recharts";
import {
  ChartTooltipContent,
  ChartTooltip,
  ChartContainer,
} from "@/components/ui/chart";
import { EyeOpenIcon, FileIcon, TrashIcon } from "@radix-ui/react-icons";
import { UserIcon } from "lucide-react";

function DashboardComp() {
  return (
    <div>
         <main className="grid flex-1 gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Newsletter</CardTitle>
              <CardDescription>12,345 subscribers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Badge variant="secondary">Active</Badge>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon">
                    <EyeIcon className="h-4 w-4" />
                    <span className="sr-only">View</span>
                  </Button>
                  <Button variant="ghost" size="icon">
                    {/* <FilePenIcon className="h-4 w-4" /> */}
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button variant="ghost" size="icon">
                    {/* <TrashIcon className="h-4 w-4" /> */}
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Monthly Newsletter</CardTitle>
              <CardDescription>45,678 subscribers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Badge variant="secondary">Active</Badge>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon">
                    <EyeOpenIcon className="h-4 w-4" />
                    <span className="sr-only">View</span>
                  </Button>
                  <Button variant="ghost" size="icon">
                    <FileIcon className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button variant="ghost" size="icon">
                    <TrashIcon className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Quarterly Newsletter</CardTitle>
              <CardDescription>78,901 subscribers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Badge variant="outline">Inactive</Badge>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon">
                    <EyeOpenIcon className="h-4 w-4" />
                    <span className="sr-only">View</span>
                  </Button>
                  <Button variant="ghost" size="icon">
                    <FileIcon className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button variant="ghost" size="icon">
                    <TrashIcon className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Annual Newsletter</CardTitle>
              <CardDescription>123,456 subscribers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Badge variant="secondary">Active</Badge>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon">
                    <EyeOpenIcon className="h-4 w-4" />
                    <span className="sr-only">View</span>
                  </Button>
                  <Button variant="ghost" size="icon">
                    <FileIcon className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button variant="ghost" size="icon">
                    <TrashIcon className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>
                View insights and performance metrics for your newsletters.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Total Subscribers</p>
                    <p className="text-2xl font-bold">160,380</p>
                  </div>
                  <UserIcon className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Open Rate</p>
                    <p className="text-2xl font-bold">24.5%</p>
                  </div>
                  <MailOpenIcon className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Click Rate</p>
                    <p className="text-2xl font-bold">12.3%</p>
                  </div>
                  <MousePointerClickIcon className="h-8 w-8 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Subscriber Growth</CardTitle>
              <CardDescription>
                Track the growth of your newsletter subscriber base over time.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  desktop: {
                    label: "Desktop",
                    color: "#2563eb",
                  },
                  mobile: {
                    label: "Mobile",
                    color: "#60a5fa",
                  },
                }}
                className="min-h-[200px] w-full"
              >
                <BarChart
                data={[
                    { month: "January", desktop: 186, mobile: 80 },
                    { month: "February", desktop: 305, mobile: 200 },
                    { month: "March", desktop: 237, mobile: 120 },
                    { month: "April", desktop: 73, mobile: 190 },
                    { month: "May", desktop: 209, mobile: 130 },
                    { month: "June", desktop: 214, mobile: 140 },
                 ]}
>
                <Bar
                    dataKey="desktop"
                    fill="var(--color-desktop)"
                    radius={4}
                />
                <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Open and Click Rates</CardTitle>
              <CardDescription>
                Monitor the engagement of your newsletter subscribers.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BarChart className="aspect-[9/4]" />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default DashboardComp;