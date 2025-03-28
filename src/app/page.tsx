"use client"

import React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ChevronRight, File, Folder, Upload } from "lucide-react"

import { Button } from "~/components/ui/button"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"

// Mock data structure
const mockData = {
  root: {
    id: "root",
    name: "My Drive",
    type: "folder",
    children: ["folder1", "folder2", "file1", "file2"],
    parent: null,
  },
  folder1: {
    id: "folder1",
    name: "Documents",
    type: "folder",
    children: ["folder3", "file3", "file4"],
    parent: "root",
  },
  folder2: {
    id: "folder2",
    name: "Photos",
    type: "folder",
    children: ["file5", "file6"],
    parent: "root",
  },
  folder3: {
    id: "folder3",
    name: "Work",
    type: "folder",
    children: ["file7"],
    parent: "folder1",
  },
  file1: {
    id: "file1",
    name: "Resume.pdf",
    type: "file",
    mimeType: "application/pdf",
    size: "2.4 MB",
    lastModified: "Mar 15, 2024",
    parent: "root",
  },
  file2: {
    id: "file2",
    name: "Budget.xlsx",
    type: "file",
    mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    size: "1.2 MB",
    lastModified: "Mar 20, 2024",
    parent: "root",
  },
  file3: {
    id: "file3",
    name: "Project Plan.docx",
    type: "file",
    mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    size: "3.1 MB",
    lastModified: "Mar 10, 2024",
    parent: "folder1",
  },
  file4: {
    id: "file4",
    name: "Meeting Notes.txt",
    type: "file",
    mimeType: "text/plain",
    size: "0.5 MB",
    lastModified: "Mar 22, 2024",
    parent: "folder1",
  },
  file5: {
    id: "file5",
    name: "Vacation.jpg",
    type: "file",
    mimeType: "image/jpeg",
    size: "5.7 MB",
    lastModified: "Feb 28, 2024",
    parent: "folder2",
  },
  file6: {
    id: "file6",
    name: "Family.png",
    type: "file",
    mimeType: "image/png",
    size: "4.2 MB",
    lastModified: "Mar 5, 2024",
    parent: "folder2",
  },
  file7: {
    id: "file7",
    name: "Presentation.pptx",
    type: "file",
    mimeType: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    size: "8.3 MB",
    lastModified: "Mar 18, 2024",
    parent: "folder3",
  },
}

export default function DriveClone() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const folderId = searchParams.get("folder") || "root"
  const currentFolder = mockData[folderId]
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)

  // Set dark theme as default
  useEffect(() => {
    document.documentElement.classList.add("dark")
  }, [])

  // Build breadcrumb path
  const buildPath = (id) => {
    const path = []
    let current = mockData[id]

    while (current) {
      path.unshift(current)
      current = current.parent ? mockData[current.parent] : null
    }

    return path
  }

  const breadcrumbPath = buildPath(folderId)

  // Handle folder click
  const handleFolderClick = (id) => {
    router.push(`?folder=${id}`)
  }

  // Handle file click (in a real app, this would download or open the file)
  const handleFileClick = (id) => {
    // Mock file opening - in a real app, this would redirect to the file
    alert(`Opening file: ${mockData[id].name}`)
  }

  // Mock file upload
  const handleUpload = (e) => {
    e.preventDefault()
    setUploadDialogOpen(false)
    alert("File upload simulated successfully!")
  }

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Google Drive Clone</h1>

        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Upload className="mr-2 h-4 w-4" />
              Upload
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload File</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpload} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="file">Select File</Label>
                <Input id="file" type="file" />
              </div>
              <Button type="submit">Upload</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Fixed breadcrumb implementation */}
      <div className="mb-6">
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbPath.map((item, index) => (
              <React.Fragment key={item.id}>
                <BreadcrumbItem>
                  <BreadcrumbLink href={`?folder=${item.id}`} className="flex items-center">
                    {index === 0 && <Folder className="mr-1 h-4 w-4" />}
                    {item.name}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {index < breadcrumbPath.length - 1 && (
                  <BreadcrumbSeparator>
                    <ChevronRight className="h-4 w-4" />
                  </BreadcrumbSeparator>
                )}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="border rounded-md border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50%]">Name</TableHead>
              <TableHead>Last Modified</TableHead>
              <TableHead>Size</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentFolder.children.map((childId) => {
              const item = mockData[childId]
              return (
                <TableRow key={item.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell
                    className="font-medium"
                    onClick={() => (item.type === "folder" ? handleFolderClick(item.id) : handleFileClick(item.id))}
                  >
                    <div className="flex items-center">
                      {item.type === "folder" ? (
                        <Folder className="mr-2 h-5 w-5 text-blue-400" />
                      ) : (
                        <File className="mr-2 h-5 w-5 text-gray-400" />
                      )}
                      {item.name}
                    </div>
                  </TableCell>
                  <TableCell>{item.type === "file" ? item.lastModified : "—"}</TableCell>
                  <TableCell>{item.type === "file" ? item.size : "—"}</TableCell>
                </TableRow>
              )
            })}
            {currentFolder.children.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                  This folder is empty
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

