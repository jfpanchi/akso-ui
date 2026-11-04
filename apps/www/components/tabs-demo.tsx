"use client";

import { Tabs, TabsList, TabsPanel, TabsTrigger } from "@/registry/akso/ui/tabs";

/** Demo used by the docs page and by the e2e tests. */
export function TabsDemo() {
  return (
    <Tabs defaultValue="profile">
      <TabsList aria-label="Account settings">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
      </TabsList>
      <TabsPanel value="profile">Your name and photo are visible to other people.</TabsPanel>
      <TabsPanel value="password">Use at least 12 characters.</TabsPanel>
      <TabsPanel value="notifications">Choose which emails you get.</TabsPanel>
    </Tabs>
  );
}
