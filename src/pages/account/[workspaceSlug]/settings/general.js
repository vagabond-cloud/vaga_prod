import { useEffect, useState } from 'react';
import { DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import toast from 'react-hot-toast';
import isAlphanumeric from 'validator/lib/isAlphanumeric';
import isSlug from 'validator/lib/isSlug';

import Button from '@/components/Button/index';
import Card from '@/components/Card/index';
import api from '@/lib/common/api';
import { useWorkspace } from '@/providers/workspace';
import Input from '@/components/Input';
import Select from '@/components/Select';
import { useForm, Controller } from "react-hook-form";

const General = ({ isTeamOwner, workspace, modules, company }) => {

  const router = useRouter();
  const { setWorkspace } = useWorkspace();
  const [isSubmitting, setSubmittingState] = useState(false);
  const [name, setName] = useState(workspace?.name || '');
  const [slug, setSlug] = useState(workspace?.slug || '');

  const validName = name?.length > 0 && name?.length <= 16;
  const validSlug =
    slug?.length > 0 &&
    slug?.length <= 16 &&
    isSlug(slug) &&
    isAlphanumeric(slug, undefined, { ignore: '-' });

  const defaultValues = {
    id: modules?.find((m) => m.active)?.id || ''
  }

  const { handleSubmit, control, formState: { errors } } = useForm({ defaultValues });
  const onSubmit = data => updateActive(data);

  const changeName = (event) => {
    event.preventDefault();
    setSubmittingState(true);
    api(`/api/workspace/${workspace?.slug}/name`, {
      body: { name },
      method: 'PUT',
    }).then((response) => {
      setSubmittingState(false);

      if (response.errors) {
        Object.keys(response.errors).forEach((error) =>
          toast.error(response.errors[error].msg)
        );
      } else {
        toast.success('Workspace name successfully updated!');
      }
    });
  };

  const changeSlug = (event) => {
    event.preventDefault();
    setSubmittingState(true);
    api(`/api/workspace/${workspace?.slug}/slug`, {
      body: { slug },
      method: 'PUT',
    }).then((response) => {
      setSubmittingState(false);
      const slug = response?.data?.slug;

      if (response.errors) {
        Object.keys(response.errors).forEach((error) =>
          toast.error(response.errors[error].msg)
        );
      } else {
        toast.success('Workspace slug successfully updated!');
        router.replace(`/account/${slug}/settings/general`);
      }
    });
  };

  const copyToClipboard = () => toast.success('Copied to clipboard!');

  const handleNameChange = (event) => setName(event.target.value);

  const handleSlugChange = (event) => setSlug(event.target.value);

  useEffect(() => {
    setName(workspace?.name);
    setSlug(workspace?.slug);
    setWorkspace(workspace);
  }, []);

  const updateActive = async (data) => {
    const getActive = modules?.filter((m) => m.active)

    const res = await api(`/api/modules/setShopfront`, {
      method: 'PUT',
      body: {
        id: data.id,
        oldId: getActive[0].id
      }
    })
    if (res.setActive) {
      toast.success(`${res.setActive.name} - is now active`);
      router.replace(router.asPath)
    } else {
      toast.error('Something went wrong');
    }
  }


  return (
    <div>
      <Card>
        <Card.Body
          title="Workspace Name"
          subtitle="Used to identify your Workspace on the Dashboard"
        >
          <Input
            className="px-3 py-2 border rounded md:w-1/2"
            disabled={isSubmitting || !isTeamOwner}
            onChange={handleNameChange}
            type="text"
            value={name}
          />
        </Card.Body>
        <Card.Footer>
          <small>Please use 16 characters at maximum</small>
          {isTeamOwner && (
            <Button
              className="text-white bg-red-600 hover:bg-red-500"
              disabled={!validName || isSubmitting}
              onClick={changeName}
            >
              Save
            </Button>
          )}
        </Card.Footer>
      </Card>
      <div className="h-6" />
      <Card>
        <Card.Body
          title="Workspace Slug"
          subtitle="Used to identify your Workspace on the Dashboard"
        >
          <div className="flex items-center space-x-3">
            <Input
              className="px-3 py-2 border rounded md:w-96"
              disabled={isSubmitting || !isTeamOwner}
              onChange={handleSlugChange}
              type="text"
              value={slug}
            />
            <span className={`w-10 text-sm ${slug?.length > 16 && 'text-red-600'}`}>
              {slug?.length} / 16
            </span>
          </div>
        </Card.Body>
        <Card.Footer>
          <small>
            Please use 16 characters at maximum. Hyphenated alphanumeric
            characters only.
          </small>
          {isTeamOwner && (
            <Button
              className="text-white bg-red-600 hover:bg-red-500"
              disabled={!validSlug || isSubmitting}
              onClick={changeSlug}
            >
              Save
            </Button>
          )}
        </Card.Footer>
      </Card>
      <div className="h-6" />

      <Card>
        <Card.Body
          title="Workspace ID"
          subtitle="Used when interacting with APIs"
        >
          <div className="flex items-center justify-between px-3 py-2 space-x-5 font-mono text-sm border rounded md:w-1/2">
            <span className="overflow-x-auto">{workspace?.workspaceCode}</span>
            <CopyToClipboard
              onCopy={copyToClipboard}
              text={workspace?.workspaceCode}
            >
              <DocumentDuplicateIcon className="w-5 h-5 cursor-pointer hover:text-red-600" />
            </CopyToClipboard>
          </div>
        </Card.Body>
      </Card>
      <div className="h-6" />
      <Card>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card.Body
            title="Activate Shopfront"
            subtitle="Define the module to be active on the shopfront"
          >
            <div className="flex items-center justify-between font-mono text-sm  rounded md:w-1/2">
              <div className="w-full">
                <Controller
                  name="id"
                  id="id"
                  control={control}
                  render={({ field }) => (
                    <Select
                      className="w-96"
                      {...field}
                    >
                      {modules?.map((module, index) => (
                        <option key={index} value={module.id}>{module.name}</option>
                      ))}
                    </Select>
                  )}
                />
              </div>
            </div>
          </Card.Body>
          <Card.Footer>
            <small>Saving this settings will change your Shopfront</small>
            {isTeamOwner && (
              <Button
                type="submit"
                className="text-white bg-red-600 hover:bg-red-500"
              >
                Save
              </Button>
            )}
          </Card.Footer>
        </form>
      </Card>
      <div className="h-6" />

      <Card>
        <Card.Body
          title={company ? company?.company_name : "Register Company"}
          subtitle={company ? "Application ID:" + company?.applicationid : "Register your company to be able to use more features"}
        >
          {company &&
            <div className="flex items-center justify-between font-mono text-sm  rounded md:w-1/2">
              <div className="w-full">
                {"Status: " + company?.status}
              </div>
            </div>
          }
        </Card.Body>
        {!company &&
          <Card.Footer>
            <small>Click to register your company</small>
            {isTeamOwner && (
              <Button
                className="text-white bg-red-600 hover:bg-red-500"
                disabled={!validName || isSubmitting}
                onClick={() => router.push(`/account/${workspace?.slug}/settings/company`)}
              >
                Register Now
              </Button>
            )}
          </Card.Footer>
        }
      </Card>
    </div >
  );
};

export default General;
