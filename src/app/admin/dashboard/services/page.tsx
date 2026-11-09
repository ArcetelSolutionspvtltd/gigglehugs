import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getServices } from '@/lib/queries';
import { getIcon } from '@/lib/icons';
import { ServiceForm } from './_components/service-form';
import { DeleteServiceButton } from './_components/delete-service-button';

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold md:text-2xl">Services</h1>
        <div className="ml-auto">
          <ServiceForm>
            <Button size="sm" className="gap-1">
              <PlusCircle className="h-4 w-4" />
              Add Service
            </Button>
          </ServiceForm>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Manage Services</CardTitle>
          <CardDescription>
            Add, edit, or delete your babysitting services.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="hidden w-[100px] sm:table-cell">Icon</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services?.map((service) => {
                  const Icon = getIcon(service.icon_name);
                  return (
                    <TableRow key={service.id}>
                      <TableCell className="hidden sm:table-cell">
                        <div className="bg-primary/10 p-2 rounded-md inline-flex">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{service.title}</TableCell>
                      <TableCell>{service.description}</TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <ServiceForm service={service}>
                            <Button variant="outline" size="sm">Edit</Button>
                          </ServiceForm>
                          <DeleteServiceButton serviceId={service.id} />
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}