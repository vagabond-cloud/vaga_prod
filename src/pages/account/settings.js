import { useState } from 'react';
import { useRouter } from 'next/router';
import { DocumentDuplicateIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { getSession, signOut } from 'next-auth/react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import toast from 'react-hot-toast';
import isEmail from 'validator/lib/isEmail';
import Input from '@/components/Input';
import Button from '@/components/Button/index';
import Card from '@/components/Card/index';
import Content from '@/components/Content/index';
import Meta from '@/components/Meta';
import Modal from '@/components/Modal/index';
import { AccountLayout } from '@/layouts/index';
import api from '@/lib/common/api';
import { getUser } from '@/prisma/services/user';

import { v4 as uuidv4 } from 'uuid'

const Settings = ({ user }) => {
  const [email, setEmail] = useState(user.email || '');
  const [isSubmitting, setSubmittingState] = useState(false);
  const [name, setName] = useState(user.name || '');
  const [company, setCompany] = useState(user.company || '');
  const [showModal, setModalState] = useState(false);
  const [userCode] = useState(user.userCode);
  const [apikey] = useState(user.apikey);
  const [secret] = useState(user.secret);
  const [hide, setHide] = useState(true);
  const [address, setAddress] = useState(user.vaga_address || '');
  const [rawMnemonic, setRawMnemonic] = useState('');
  const [verifyEmail, setVerifyEmail] = useState('');
  const validName = name.length > 0 && name.length <= 32;
  const validEmail = isEmail(email);
  const verifiedEmail = verifyEmail === email;

  const router = useRouter();

  const createWallet = async (event) => {
    event.preventDefault();

    const res = await api('/api/vagachain/createWallet', {
      method: 'GET',
    });

    setAddress(res.data.address);
    setRawMnemonic(res.data.raw);
    setSubmittingState(true);
    api('/api/vagachain/createWallet', {
      body: {
        address: res.data.address,
        mnemonic: res.data.mnemonic
      },
      method: 'POST',
    }).then((response) => {
      setSubmittingState(false);

      if (response.errors) {
        Object.keys(response.errors).forEach((error) =>
          toast.error(response.errors[error].msg)
        );
      } else {
        toast.success('Name successfully updated!');
      }

    })
  }

  const copyToClipboard = () => toast.success('Copied to clipboard!');
  const hideContent = () => setHide(!hide);
  const changeName = (event) => {
    event.preventDefault();
    setSubmittingState(true);
    api('/api/user/name', {
      body: { name },
      method: 'PUT',
    }).then((response) => {
      setSubmittingState(false);

      if (response.errors) {
        Object.keys(response.errors).forEach((error) =>
          toast.error(response.errors[error].msg)
        );
      } else {
        toast.success('Name successfully updated!');
      }
    });
  };

  const changeCompany = (event) => {
    event.preventDefault();
    setSubmittingState(true);
    api('/api/user/company', {
      body: { company },
      method: 'PUT',
    }).then((response) => {
      setSubmittingState(false);

      if (response.errors) {
        Object.keys(response.errors).forEach((error) =>
          toast.error(response.errors[error].msg)
        );
      } else {
        toast.success('Company name successfully updated!');
      }
    });
  };

  const changeEmail = (event) => {
    event.preventDefault();
    const result = confirm(
      'Are you sure you want to update your email address?'
    );

    if (result) {
      setSubmittingState(true);
      api('/api/user/email', {
        body: { email },
        method: 'PUT',
      }).then((response) => {
        setSubmittingState(false);

        if (response.errors) {
          Object.keys(response.errors).forEach((error) =>
            toast.error(response.errors[error].msg)
          );
        } else {
          toast.success('Email successfully updated and signing you out!');
          setTimeout(() => signOut({ callbackUrl: '/auth/login' }), 2000);
        }
      });
    }
  };


  const generateApi = (event) => {
    event.preventDefault();
    const result = confirm(
      'Are you sure you want to create API and Secrete Key?'
    );

    const apiKey = uuidv4();
    const apiSecret = uuidv4();

    if (result) {
      setSubmittingState(true);
      api('/api/user/api', {
        body: { email, apiKey, apiSecret },
        method: 'PUT',
      }).then((response) => {
        setSubmittingState(false);

        if (response.errors) {
          Object.keys(response.errors).forEach((error) =>
            toast.error(response.errors[error].msg)
          );
        } else {
          toast.success('API & Secret successfully updated!');
          router.replace(router.asPath);
        }
      });
    }
  };


  const deactivateAccount = (event) => {
    event.preventDefault();
    setSubmittingState(true);
    api('/api/user', {
      method: 'DELETE',
    }).then((response) => {
      setSubmittingState(false);
      toggleModal();

      if (response.errors) {
        Object.keys(response.errors).forEach((error) =>
          toast.error(response.errors[error].msg)
        );
      } else {
        toast.success('Account has been deactivated!');
      }
    });
  };

  const handleEmailChange = (event) => setEmail(event.target.value);

  const handleNameChange = (event) => setName(event.target.value);

  const handleCompanyChange = (event) => setCompany(event.target.value);

  const handleVerifyEmailChange = (event) => setVerifyEmail(event.target.value);

  const toggleModal = () => {
    setVerifyEmail('');
    setModalState(!showModal);
  };

  return (
    <AccountLayout>
      <Meta title="Vagabond - Account Settings" />
      <Content.Title
        title="Account Settings"
        subtitle="Manage your profile, preferences, and account settings"
      />
      <Content.Divider />
      <Content.Container>
        <Card>
          <form>
            <Card.Body
              title="Your Name"
              subtitle="Please enter your full name, or a display name you are comfortable with"
            >
              <Input
                className="px-3 py-2 border rounded md:w-1/2"
                disabled={isSubmitting}
                onChange={handleNameChange}
                type="text"
                value={name}
              />
            </Card.Body>
            <Card.Footer>
              <small>Please use 32 characters at maximum</small>
              <Button
                className="text-white bg-red-600 hover:bg-red-500"
                disabled={!validName || isSubmitting}
                onClick={changeName}
              >
                Save
              </Button>
            </Card.Footer>
          </form>
        </Card>
        <Card>
          <form>
            <Card.Body
              title="Email Address"
              subtitle="Please enter the email address you want to use to log in with
              Vagabond"
            >
              <Input
                className="px-3 py-2 border rounded md:w-1/2"
                disabled={isSubmitting}
                onChange={handleEmailChange}
                type="email"
                value={email}
              />
            </Card.Body>
            <Card.Footer>
              <small>We will email you to verify the change</small>
              <Button
                className="text-white bg-red-600 hover:bg-red-500"
                disabled={!validEmail || isSubmitting}
                onClick={changeEmail}
              >
                Save
              </Button>
            </Card.Footer>
          </form>
        </Card>
        <Card>
          <form>
            <Card.Body
              title="Company"
              subtitle="Please enter your full company name"
            >
              <Input
                className="px-3 py-2 border rounded md:w-1/2"
                disabled={isSubmitting}
                onChange={handleCompanyChange}
                type="text"
                value={company}
              />
            </Card.Body>
            <Card.Footer>
              <small>Please use 64 characters at maximum</small>
              <Button
                className="text-white bg-red-600 hover:bg-red-500"
                disabled={!validName || isSubmitting}
                onClick={changeCompany}
              >
                Save
              </Button>
            </Card.Footer>
          </form>
        </Card>
        <Card>
          <Card.Body
            title="Personal Account ID"
            subtitle="Used when interacting with APIs"
          >
            <div className="flex items-center justify-between px-3 py-2 space-x-5 font-mono text-sm border rounded md:w-1/2">
              <span className="overflow-x-auto">{userCode}</span>
              <CopyToClipboard onCopy={copyToClipboard} text={userCode}>
                <DocumentDuplicateIcon className="w-5 h-5 cursor-pointer hover:text-red-600" />
              </CopyToClipboard>
            </div>
          </Card.Body>
        </Card>
        <Card>
          {rawMnemonic &&
            <div className="flex w-full relative">
              <div className="absolute z-10 h-40 w-full  bg-white">
                <div className="flex flex-wrap gap-4 my-4 mx-4">
                  {rawMnemonic.split(' ').map((word, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 bg-gray-800 rounded-md"
                    >
                      <span className="overflow-x-auto text-gray-50">{word}</span>
                    </div>
                  )
                  )}
                </div>
                <p className="text-center text-sm text-gray-500">
                  Save these words in a safe place. You will need them to recover your wallet. <span className="text-red-600 cursor-pointer" onClick={() => setRawMnemonic(false)}>I have stored this keywords</span>
                </p>
              </div>

            </div>
          }
          <Card.Body
            title="VagaChain Address"
            subtitle="Your unique Wallet address"
          >
            <div className="flex items-center justify-between px-3 py-2 space-x-5 font-mono text-sm border rounded md:w-1/2">
              <span className="overflow-x-auto">{address}</span>
              <CopyToClipboard onCopy={copyToClipboard} text={address}>
                <DocumentDuplicateIcon className="w-5 h-5 cursor-pointer hover:text-red-600" />
              </CopyToClipboard>
            </div>
          </Card.Body>
          <Card.Footer>
            <small>A Wallet address will be created on VagaChain</small>
            <Button
              className="text-white bg-red-600 hover:bg-red-500"
              disabled={address || isSubmitting}
              onClick={createWallet}
            >
              Create
            </Button>
          </Card.Footer>
        </Card>
        <Card>
          <Card.Body
            title="API Key"
            subtitle="Use this key when interacting with APIs"
          >
            <div className="flex items-center justify-between px-3 py-2 space-x-5 font-mono text-sm border rounded md:w-1/2">
              <span className={`overflow-x-auto ${hide ? 'blur-sm	' : 'blur-none'}`}> {apikey}</span>
              <div className="flex gap-4">
                {hide ?
                  <EyeIcon className="w-5 h-5 cursor-pointer hover:text-red-600" onClick={() => hideContent()} />
                  :
                  <EyeSlashIcon className="w-5 h-5 cursor-pointer hover:text-red-600" onClick={() => hideContent()} />
                }
                <CopyToClipboard onCopy={copyToClipboard} text={apikey}>
                  <DocumentDuplicateIcon className="w-5 h-5 cursor-pointer hover:text-red-600" />
                </CopyToClipboard>
              </div>
            </div>
          </Card.Body>
          <Card.Body
            title="Secret Key"
            subtitle="Store this key securely, it is used to sign API requests"
          >
            <div className={`flex items-center justify-between px-3 py-2 space-x-5 font-mono text-sm border rounded md:w-1/2`}>
              <span className={`overflow-x-auto ${hide ? 'blur-sm	' : 'blur-none'}`}>{secret}</span>
              <div className="flex gap-4">            {hide ?
                <EyeIcon className="w-5 h-5 cursor-pointer hover:text-red-600" onClick={() => hideContent()} />
                :
                <EyeSlashIcon className="w-5 h-5 cursor-pointer hover:text-red-600" onClick={() => hideContent()} />
              }
                <CopyToClipboard onCopy={copyToClipboard} text={secret}>
                  <DocumentDuplicateIcon className="w-5 h-5 cursor-pointer hover:text-red-600" />
                </CopyToClipboard>
              </div>
            </div>
          </Card.Body>
          {!apikey && !secret &&
            <Card.Footer>
              <small>Generate your API & Secret key</small>
              <Button
                className="text-white bg-red-600 hover:bg-red-500"
                disabled={!validEmail || isSubmitting}
                onClick={generateApi}
              >
                Create
              </Button>
            </Card.Footer>
          }
        </Card>

        <Card danger>
          <Card.Body
            title="Danger Zone"
            subtitle="Permanently remove your Personal Account and all of its contents
              from Vagabond platform"
          />
          <Card.Footer>
            <small>
              This action is not reversible, so please continue with caution
            </small>
            <Button
              className="text-white bg-red-600 hover:bg-red-500"
              onClick={toggleModal}
            >
              Deactivate Personal Account
            </Button>
          </Card.Footer>
          <Modal
            show={showModal}
            title="Deactivate Personal Account"
            toggle={toggleModal}
          >
            <p>
              Your account will be deleted, along with all of its Workspace
              contents.
            </p>
            <p className="px-3 py-2 text-red-600 border border-red-600 rounded">
              <strong>Warning:</strong> This action is not reversible. Please be
              certain.
            </p>
            <div className="flex flex-col">
              <label className="text-sm text-gray-400">
                Enter <strong>{user.email}</strong> to continue:
              </label>
              <Input
                className="px-3 py-2 border rounded"
                disabled={isSubmitting}
                onChange={handleVerifyEmailChange}
                type="email"
                value={verifyEmail}
              />
            </div>
            <div className="flex flex-col items-stretch">
              <Button
                className="text-white bg-red-600 hover:bg-red-500"
                disabled={!verifiedEmail || isSubmitting}
                onClick={deactivateAccount}
              >
                <span>Deactivate Personal Account</span>
              </Button>
            </div>
          </Modal>
        </Card>
      </Content.Container>
    </AccountLayout >
  );
};

export const getServerSideProps = async (context) => {
  const session = await getSession(context);
  const { email, name, userCode, apikey, secret, company, vaga_address } = await getUser(session.user?.userId);

  return {
    props: {
      user: {
        email,
        name,
        company,
        userCode,
        apikey,
        secret,
        vaga_address
      },
    },
  };
};

export default Settings;
