'use client';

import { useActionState, useState, useRef, useEffect, type ReactNode } from 'react';
import { useFormStatus } from 'react-dom';
import Image from 'next/image';
import ReactCrop, { centerCrop, makeAspectCrop, type Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { PlusCircle, Loader2, Image as ImageIcon, RotateCw } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { upsertSitterAction, type FormState } from '../actions';
import type { Sitter } from '@/lib/types';
import { dataURLtoFile } from '@/lib/utils';


function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {isEditing ? 'Saving...' : 'Adding...'}
        </>
      ) : (
        isEditing ? 'Save Changes' : 'Add Sitter'
      )}
    </Button>
  );
}

type SitterFormProps = {
  children: ReactNode;
  sitter?: Sitter;
};

export function SitterForm({ children, sitter }: SitterFormProps) {
  const isEditing = !!sitter;
  const initialState: FormState = { message: '', errors: undefined, success: false };
  const [state, formAction] = useActionState(upsertSitterAction, initialState);
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(sitter?.avatar_url || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [crop, setCrop] = useState<Crop>();
  const [imgSrc, setImgSrc] = useState('');
  const imgRef = useRef<HTMLImageElement>(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) {
        // Reset state when sheet closes
        setAvatarPreview(sitter?.avatar_url || null);
        setImgSrc('');
        if (formRef.current) {
          formRef.current.reset();
        }
    }
  }, [isOpen, sitter]);

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast({
          title: isEditing ? 'Success!' : 'Sitter Added!',
          description: state.message,
        });
        setIsOpen(false);
      } else {
        toast({
          title: 'Oops!',
          description: state.message,
          variant: 'destructive',
        });
      }
    }
  }, [state, toast, isEditing]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined); // Reset crop on new image
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImgSrc(reader.result?.toString() || '');
        setIsCropModalOpen(true);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const initialCrop = centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 90,
        },
        1,
        width,
        height,
      ),
      width,
      height,
    )
    setCrop(initialCrop);
  };
  
  const getCroppedImg = async () => {
    const image = imgRef.current;
    if (!image || !crop || !crop.width || !crop.height) {
      return;
    }
  
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    
    const cropWidth = crop.width * scaleX;
    const cropHeight = crop.height * scaleY;
    const cropX = crop.x * scaleX;
    const cropY = crop.y * scaleY;

    // Use a fixed size for the canvas to maintain quality
    const targetSize = 512;
    canvas.width = targetSize;
    canvas.height = targetSize;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }
  
    ctx.drawImage(
      image,
      cropX,
      cropY,
      cropWidth,
      cropHeight,
      0,
      0,
      targetSize,
      targetSize,
    );
  
    return new Promise<string | null>((resolve) => {
      resolve(canvas.toDataURL('image/png'));
    });
  };

  const handleCropConfirm = async () => {
    const croppedImageUrl = await getCroppedImg();
    if (croppedImageUrl) {
      setAvatarPreview(croppedImageUrl);
      const file = dataURLtoFile(croppedImageUrl, 'avatar.png');
      // Create a new DataTransfer object and add the file
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      // Set the files property of the file input
      if (fileInputRef.current) {
        fileInputRef.current.files = dataTransfer.files;
      }
      setIsCropModalOpen(false);
    }
  };

  return (
    <>
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{isEditing ? 'Edit Sitter' : 'Add a New Sitter'}</SheetTitle>
          <SheetDescription>
            {isEditing
              ? 'Update the details for this sitter.'
              : 'Fill out the form to add a new sitter to your website.'}
          </SheetDescription>
        </SheetHeader>
        <form
            ref={formRef}
            action={formAction}
            className="flex flex-col gap-6 mt-6"
        >
          {isEditing && <input type="hidden" name="id" value={sitter.id} />}
           <div className="space-y-2">
            <Label>Avatar</Label>
            <div className="flex items-center gap-4">
              <div className="relative h-20 w-20 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                {avatarPreview ? (
                  <Image src={avatarPreview} alt="Avatar preview" fill className="object-cover" />
                ) : (
                  <ImageIcon className="h-8 w-8 text-muted-foreground" />
                )}
              </div>
              <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                {avatarPreview ? 'Change' : 'Upload'}
              </Button>
              <Input
                ref={fileInputRef}
                id="avatar_url"
                name="avatar_url"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleAvatarChange}
              />
            </div>
             {state?.errors?.avatar_url && <p className="text-sm font-medium text-destructive">{state.errors.avatar_url[0]}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="e.g., Jane Doe"
              defaultValue={sitter?.name ?? ''}
              required
            />
            {state?.errors?.name && <p className="text-sm font-medium text-destructive">{state.errors.name[0]}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              name="bio"
              placeholder="Describe the sitter..."
              defaultValue={sitter?.bio ?? ''}
              rows={4}
              required
            />
             {state?.errors?.bio && <p className="text-sm font-medium text-destructive">{state.errors.bio[0]}</p>}
          </div>

          <SheetFooter className="mt-4">
            <SheetClose asChild>
                <Button variant="outline">Cancel</Button>
            </SheetClose>
            <SubmitButton isEditing={isEditing} />
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
    <Dialog open={isCropModalOpen} onOpenChange={setIsCropModalOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Crop Image</DialogTitle>
            </DialogHeader>
            {imgSrc && (
                <div className='flex flex-col items-center'>
                    <ReactCrop
                        crop={crop}
                        onChange={(_, percentCrop) => setCrop(percentCrop)}
                        circularCrop
                        aspect={1}
                        className='max-h-[60vh]'
                    >
                        <img ref={imgRef} src={imgSrc} alt="Source" onLoad={handleImageLoad} />
                    </ReactCrop>
                </div>
            )}
             <DialogFooter>
                <Button variant="outline" onClick={() => setIsCropModalOpen(false)}>Cancel</Button>
                <Button onClick={handleCropConfirm}>Confirm Crop</Button>
             </DialogFooter>
        </DialogContent>
    </Dialog>
    </>
  );
}
