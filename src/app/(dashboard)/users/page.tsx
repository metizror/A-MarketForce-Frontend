"use client";

import { useState } from "react";
import { UsersTable } from "@/components/UsersTable";
import type { User } from "@/types/dashboard.types";

export default function UsersPage() {
  const [users, setUsers] = useState([] as User[]);

  return <UsersTable users={users} setUsers={setUsers} />;
}

