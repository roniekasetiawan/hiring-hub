"use client";

import * as React from "react";
import DateOfBirth from "@/components/(input)/DatePicker";
import PhoneNumberInput from "@/components/(input)/PhoneNumber";
import ProvinceAutocomplete from "@/components/(input)/ProvinceAutoComplete";

export default function Page() {
  const [phone, setPhone] = React.useState<{
    country: any;
    national: string;
  } | null>(null);
  const [province, setProvince] = React.useState<any>(null);
  const [dob, setDob] = React.useState<Date | null>(null);
  return (
    <main className="max-w-md mx-auto p-6 space-y-6 pt-20">
      <DateOfBirth value={dob} onChange={setDob} required />
      <input
        className="w-full border rounded-xl p-3 mt-30"
        placeholder="Enter your email address"
      />

      <PhoneNumberInput
        required
        value={phone ?? undefined}
        onChange={(v) => setPhone(v)}
      />

      <ProvinceAutocomplete required onChange={setProvince} />
    </main>
  );
}
