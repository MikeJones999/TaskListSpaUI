export interface FileUploadModel {
    isSuccessful: boolean;
    errorMessage: string | null;
    fileName: string | null;
    storedFileNamed: string | null;
}