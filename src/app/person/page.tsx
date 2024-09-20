"use client";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function HandleCreatePerson() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    const birthdate = formData.get("birthdate") as string;
    const deathdate = formData.get("deathdate") as string | null;
    const status = formData.get("status") as string;
    const education = formData.get("education") as string;
    const hometown = formData.get("hometown") as string;

    try {
      const response = await fetch("/api/createPerson", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          birthdate,
          deathdate,
          status,
          education,
          hometown,
        }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Person info created successfully.",
        });
        router.push("/protesters");
      } else {
        toast({
          title: "Error",
          description: "Failed to create person info. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle>Create Person Info</CardTitle>
          <CardDescription>
            Enter the details of the person you want to add.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="birthdate">Birthdate</Label>
              <Input id="birthdate" name="birthdate" type="date" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deathdate">Deathdate (if applicable)</Label>
              <Input id="deathdate" name="deathdate" type="date" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select name="status">
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="alive">Alive</SelectItem>
                  <SelectItem value="deceased">Deceased</SelectItem>
                  <SelectItem value="unknown">Unknown</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="education">Education</Label>
              <Input id="education" name="education" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hometown">Hometown</Label>
              <Input id="hometown" name="hometown" />
            </div>
            <Button type="submit" text="Create" className="w-full"></Button>
          </form>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </div>
  );
}
