import { MapPin, ShieldCheck, Users } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { branches, users } from "@/lib/sample-data";

export default function BranchesPage() {
  return (
    <AppShell title="Branch Management">
      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="grid gap-4 md:grid-cols-2">
          {branches.map((branch, index) => (
            <Card key={branch.id} className="bg-black/25">
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <CardTitle>{branch.name}</CardTitle>
                  <Badge variant={index === 0 ? "default" : "muted"}>{index === 0 ? "Featured" : "Active"}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="flex gap-2 text-sm text-muted-foreground"><MapPin className="h-4 w-4 shrink-0 text-red-300" />{branch.address}</p>
                <p className="flex gap-2 text-sm text-muted-foreground"><Users className="h-4 w-4 shrink-0 text-red-300" />{users.filter((user) => user.branchId === branch.id).length || 2} staff assigned</p>
                <Button variant="secondary" className="w-full">Manage Branch</Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-black/25">
          <CardHeader><CardTitle>Add / Edit Branch</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Input placeholder="Branch name" />
            <Input placeholder="Address" />
            <Input placeholder="Contact number" />
            <Input placeholder="Manager" />
            <Button className="w-full"><ShieldCheck className="h-4 w-4" />Save Branch</Button>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
