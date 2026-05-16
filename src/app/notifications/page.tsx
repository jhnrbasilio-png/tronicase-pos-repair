import { Bell, CheckCircle2, Megaphone, PackageSearch, Wrench } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { notifications } from "@/lib/sample-data";

const icons = {
  "Low Stock": PackageSearch,
  "New Repair": Wrench,
  "Completed Repair": CheckCircle2,
  Subscription: Bell
};

export default function NotificationsPage() {
  return (
    <AppShell title="Notifications">
      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <Card className="bg-black/25">
          <CardHeader><CardTitle>Notification Center</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {notifications.map((notification) => {
              const Icon = icons[notification.type as keyof typeof icons] || Bell;
              return (
                <div key={notification.id} className="flex items-start gap-3 rounded-md border bg-black/20 p-4">
                  <div className="grid h-10 w-10 place-items-center rounded-md bg-red-500/15 text-red-200">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium">{notification.title}</p>
                      {notification.unread ? <Badge>Unread</Badge> : <Badge variant="muted">Read</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground">{notification.type} - {notification.branch}</p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="bg-black/25">
          <CardHeader><CardTitle>Branch Announcement</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Input placeholder="Title" />
            <Select>
              <option>All branches</option>
              <option>Managers only</option>
              <option>Technicians only</option>
              <option>Cashiers only</option>
            </Select>
            <Textarea placeholder="Announcement message" />
            <Button className="w-full"><Megaphone className="h-4 w-4" />Publish</Button>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
