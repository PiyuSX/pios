"use client";

import { useEffect, useRef } from "react";

import {
  initializeFilesystem,
  createFile,
  getFileContent,
  updateFileContent,
  moveEntry,
  createFolder,
  getFolderContents,
  deleteEntry,
} from "@/app/filesystem/filesystem";

export default function FilesystemTest() {
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const testFilesystem = async () => {
      const testId = crypto.randomUUID().slice(0, 8);

      try {
        await initializeFilesystem();

        // Test creating and updating a file
        const file = await createFile(
          `browser-test-${testId}.txt`,
          "system-desktop",
          "Hello from PiOS!",
        );

        console.log("Created:", file);
        console.log("Original:", await getFileContent(file.id));

        await updateFileContent(file.id, "PiOS filesystem is working!");

        console.log("Updated:", await getFileContent(file.id));

        // Test moving a file
        const moveTestFile = await createFile(
          `move-test-${testId}.txt`,
          "system-desktop",
          "Testing file movement",
        );

        await moveEntry(moveTestFile.id, "system-downloads");

        const downloads = await getFolderContents("system-downloads");

        console.log(
          "File moved:",
          downloads.some((entry) => entry.id === moveTestFile.id),
        );

        // Test moving a folder
        const testFolder = await createFolder(
          `move-test-folder-${testId}`,
          "system-desktop",
        );

        await moveEntry(testFolder.id, "system-downloads");

        const movedFolders = await getFolderContents("system-downloads");

        console.log(
          "Folder moved:",
          movedFolders.some((entry) => entry.id === testFolder.id),
        );

        // Test preventing a folder from moving into itself
        try {
          await moveEntry(testFolder.id, testFolder.id);
          console.error("Folder validation failed");
        } catch (error) {
          console.log("Self-move blocked:", error.message);
        }

        // Test deleting a file
        const deleteTestFile = await createFile(
          `delete-test-${testId}.txt`,
          "system-desktop",
          "This file will be deleted",
        );

        const deletedFileCount = await deleteEntry(deleteTestFile.id);

        console.log("File deleted:", deletedFileCount === 1);

        // Test deleting a folder and its contents
        const deleteTestFolder = await createFolder(
          `delete-test-folder-${testId}`,
          "system-desktop",
        );

        const nestedFolder = await createFolder(
          `nested-folder-${testId}`,
          deleteTestFolder.id,
        );

        const nestedFile = await createFile(
          `nested-file-${testId}.txt`,
          nestedFolder.id,
          "Nested content",
        );

        console.log("Parent folder:", deleteTestFolder);
        console.log("Nested folder:", nestedFolder);
        console.log("Nested file:", nestedFile);

        console.log(
          "Parent contents:",
          await getFolderContents(deleteTestFolder.id),
        );

        console.log(
          "Nested contents:",
          await getFolderContents(nestedFolder.id),
        );

        const deletedFolderCount = await deleteEntry(deleteTestFolder.id);

        console.log("Deleted folder count:", deletedFolderCount);
        console.log("Folder contents deleted:", deletedFolderCount === 3);

        // Test protecting system folders
        try {
          await deleteEntry("system-desktop");

          console.error("System folder protection failed");
        } catch (error) {
          console.log("System folder protected:", error.message);
        }

        console.log("ALL TESTS COMPLETED!");
      } catch (error) {
        console.error("TEST FAILED:", error);
      }
    };

    testFilesystem();
  }, []);

  return null;
}
