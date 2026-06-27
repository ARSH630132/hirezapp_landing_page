"use client";

import React, { useState, useEffect } from "react";
import { Search, X, ArrowUpDown, Terminal, Shield, Lock, Activity, Copy, Check, ChevronRight } from "lucide-react";
import { TableColumn } from "./types";

export function DataTable<T extends { id: string | number }>({ 
  columns, 
  data, 
  pageSize = 5,
  onRowClick,
  searchPlaceholder = "Search secure records...",
  searchKeys = [],
  statusField,
  statusOptions = [],
  typeField,
  typeOptions = [],
  renderDetail,
  detailTitle = "Resource Telemetry Ledger",
  categoryLabel
}: { 
  columns: TableColumn<T>[]; 
  data: T[]; 
  pageSize?: number;
  onRowClick?: (row: T) => void;
  searchPlaceholder?: string;
  searchKeys?: (keyof T | string)[];
  statusField?: keyof T | string;
  statusOptions?: { value: string; label: string }[];
  typeField?: keyof T | string;
  typeOptions?: { value: string; label: string }[];
  renderDetail?: (row: T, onClose: () => void) => React.ReactNode;
  detailTitle?: string | ((row: T) => string);
  categoryLabel?: string;
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState<keyof T | string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedType, setSelectedType] = useState("");
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isDrawerOpen) setIsDrawerOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDrawerOpen]);

  useEffect(() => {
    if (selectedRow) {
      setLogs([
        `[${new Date().toISOString().split("T")[1].substring(0, 8)}] CONNECT: Secure handshake requested for ID: ${selectedRow.id}`,
        `[${new Date().toISOString().split("T")[1].substring(0, 8)}] SECURE: TLS 1.3 active. Computing validation hash...`,
        `[${new Date().toISOString().split("T")[1].substring(0, 8)}] VERIFIED: Integrity checks 100% compliant.`
      ]);
    }
  }, [selectedRow]);

  const handleRowSelect = (row: T) => {
    setSelectedRow(row);
    setIsDrawerOpen(true);
    if (onRowClick) onRowClick(row);
  };

  useEffect(() => { setCurrentPage(1); }, [searchQuery, selectedStatus, selectedType]);

  const handleSort = (key: keyof T | string, sortable?: boolean) => {
    if (!sortable) return;
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const filteredData = data.filter((row) => {
    if (searchQuery.trim() !== "" && searchKeys.length > 0) {
      const match = searchKeys.some((k) => String(row[k as keyof T] || "").toLowerCase().includes(searchQuery.toLowerCase()));
      if (!match) return false;
    }
    if (selectedStatus && statusField) {
      if (String(row[statusField as keyof T] || "").toLowerCase() !== selectedStatus.toLowerCase()) return false;
    }
    if (selectedType && typeField) {
      if (String(row[typeField as keyof T] || "").toLowerCase() !== selectedType.toLowerCase()) return false;
    }
    return true;
  });

  const sortedData = [...filteredData];
  if (sortKey) {
    sortedData.sort((a, b) => {
      const aVal = a[sortKey as keyof T];
      const bVal = b[sortKey as keyof T];
      if (aVal === undefined || aVal === null) return 1;
      if (bVal === undefined || bVal === null) return -1;
      return sortOrder === "asc" ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
    });
  }

  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const [selectedRow, setSelectedRow] = useState<T | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

