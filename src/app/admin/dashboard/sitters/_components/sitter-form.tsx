'use client';

import { useActionState, useState, useRef, useEffect, type ReactNode, useCallback, ChangeEvent } from 'react';
import Image from 'next/image';
import Cropper, { type Area } from 'react-easy-crop';

import { Loader2, ImageIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogTrigger,
  DialogDescription,
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
import { getCroppedImg } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';
import { useFormStatus } from 'react-dom';
import { useMediaQuery } from '@/hooks/use-media-query';

const MAX_BIO_LENGTH = 150;

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
  const initialState: FormState = { message: '', success: false, errors: undefined };
  const [state, formAction] = useActionState(upsertSitterAction, initialState);

  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(sitter?.avatar_url || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [emailName, setEmailName] = useState(sitter?.email?.split('@')[0] || '');
  const [bioCharCount, setBioCharCount] = useState(sitter?.bio?.length || 0);

  const [imgSrc, setImgSrc] = useState('');
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [croppedAvatarData, setCroppedAvatarData] = useState<string | null>(null);

  const isDesktop = useMediaQuery("(min-width: 768px)");

  const resetFormState = useCallback(() => {
    setAvatarPreview(sitter?.avatar_url || null);
    setImgSrc('');
    setEmailName(sitter?.email?.split('@')[0] || '');
    setBioCharCount(sitter?.bio?.length || 0);
    setCroppedAvatarData(null);
    if(fileInputRef.current) fileInputRef.current.value = "";
    formRef.current?.reset();
  }, [sitter]);

  useEffect(() => {
    if (!isOpen) {
      resetFormState();
    }
  }, [isOpen, resetFormState]);


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
  }, [state, isEditing, toast]);

  const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImgSrc(reader.result?.toString() || '');
        setZoom(1);
        setCrop({ x: 0, y: 0 });
        setCroppedAreaPixels(null);
        setIsCropModalOpen(true);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  
  const handleCropConfirm = async () => {
    if (!croppedAreaPixels || !imgSrc) {
        toast({
            title: 'Image not ready',
            description: 'Please wait for the image to load before cropping.',
            variant: 'destructive',
        });
        return;
    }
    try {
        const croppedImageUrl = await getCroppedImg(imgSrc, croppedAreaPixels);
        if (croppedImageUrl) {
            setAvatarPreview(croppedImageUrl);
            setCroppedAvatarData(croppedImageUrl);
        }
        setIsCropModalOpen(false);
    } catch (e) {
        console.error(e);
        toast({ title: 'Cropping failed', description: 'Please try a different image.', variant: 'destructive'});
    }
  };

  const handleBioChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setBioCharCount(e.target.value.length);
  };

  const FormContent = (
    <form
        ref={formRef}
        action={formAction}
        className="flex flex-col gap-6 mt-6"
    >
      <input type="hidden" name="id" value={sitter?.id} />
      <input type="hidden" name="current_avatar_url" value={sitter?.avatar_url || ''} />
      <input type="hidden" name="avatar_data_uri" value={croppedAvatarData || ''} />

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
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleAvatarChange}
          />
        </div>
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
        <Label htmlFor="email_name">Email</Label>
        <div className="flex items-center">
          <Input
            id="email_name"
            name="email_name"
            placeholder="jane"
            value={emailName}
            onChange={(e) => setEmailName(e.target.value)}
            className="rounded-r-none focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <span className="inline-flex h-10 items-center rounded-r-md border border-l-0 border-input bg-muted px-3 text-sm text-muted-foreground">
            @gigglehugs.co.zw
          </span>
        </div>
         {state?.errors?.email_name && <p className="text-sm font-medium text-destructive">{state.errors.email_name[0]}</p>}
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
          maxLength={MAX_BIO_LENGTH}
          onChange={handleBioChange}
        />
        <div className="text-right text-sm text-muted-foreground">
            {bioCharCount}/{MAX_BIO_LENGTH}
        </div>
        {state?.errors?.bio && <p className="text-sm font-medium text-destructive">{state.errors.bio[0]}</p>}
      </div>

      {isDesktop ? (
        <SheetFooter className="mt-4">
            <SheetClose asChild>
                <Button variant="outline">Cancel</Button>
            </SheetClose>
            <SubmitButton isEditing={isEditing} />
        </SheetFooter>
      ) : (
        <DialogFooter className="mt-4">
            <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
            </DialogClose>
            <SubmitButton isEditing={isEditing} />
        </DialogFooter>
      )}
    </form>
  );

  const MainDialog = (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="max-w-[90vw] w-full rounded-lg">
            <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Sitter' : 'Add a New Sitter'}</DialogTitle>
            <DialogDescription>
                {isEditing
                ? 'Update the details for this sitter.'
                : 'Fill out the form to add a new sitter to your website.'}
            </DialogDescription>
            </DialogHeader>
            {FormContent}
        </DialogContent>
    </Dialog>
  );

  const MainSheet = (
     <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>{children}</SheetTrigger>
        <SheetContent className="sm:max-w-lg overflow-y-auto max-h-screen">
            <SheetHeader>
            <SheetTitle>{isEditing ? 'Edit Sitter' : 'Add a New Sitter'}</SheetTitle>
            <SheetDescription>
                {isEditing
                ? 'Update the details for this sitter.'
                : 'Fill out the form to add a new sitter to your website.'}
            </SheetDescription>
            </SheetHeader>
            {FormContent}
        </SheetContent>
    </Sheet>
  );


  return (
    <>
      {isDesktop ? MainSheet : MainDialog}
      <Dialog open={isCropModalOpen} onOpenChange={setIsCropModalOpen}>
        <DialogContent className="max-w-lg w-[90vw] flex flex-col max-h-[90vh]">
            <DialogHeader>
                <DialogTitle>Crop Image</DialogTitle>
                <DialogDescription>
                  Adjust the image to fit perfectly in the circular avatar frame.
                </DialogDescription>
            </DialogHeader>
            <div className="relative my-4 w-full aspect-square bg-muted rounded-md overflow-hidden">
                <Cropper
                    image={imgSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    cropShape="round"
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                />
            </div>
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label>Zoom</Label>
                    <Slider
                        value={[zoom]}
                        min={1}
                        max={3}
                        step={0.1}
                        onValueChange={(value) => setZoom(value[0])}
                    />
                </div>
            </div>
             <DialogFooter>
                <Button variant="outline" onClick={() => setIsCropModalOpen(false)}>Cancel</Button>
                <Button onClick={handleCropConfirm} disabled={!croppedAreaPixels}>Confirm Crop</Button>
             </DialogFooter>
        </DialogContent>
    </Dialog>
    </>
  );
}
