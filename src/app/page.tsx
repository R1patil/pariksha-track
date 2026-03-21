"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    const session = localStorage.getItem("pt_student");
    if (session) {
      router.replace("/student");
    } else {
      router.replace("/login");
    }
  }, [router]);
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"100vh" }}>
      <div className="spinner" />
    </div>
  );
}
