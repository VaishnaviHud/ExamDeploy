// import React from 'react'

// function TeacherDashboard() {
//   return (
//     <div>TeacherDashboard</div>
//   )
// }

// export default TeacherDashboard
import { useEffect, useState } from "react";
import { Link, Routes, Route } from "react-router-dom"; // Added Routes and Route
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "@/components/Navbar";
import RoomsList from "./RoomList";
import SubjectList from "./subjectList";
import ExamList from "./ExamPage";

const TeacherDashboard = () => {

  const token = localStorage.getItem("token");

  return (
    <div className="flex h-screen bg-gray-50">
      

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">


      </div>
    </div>
  );
};

export default TeacherDashboard;