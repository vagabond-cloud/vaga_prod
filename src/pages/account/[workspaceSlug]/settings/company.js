import { useState } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

import Button from '@/components/Button/index';
import Meta from '@/components/Meta/index';
import Modal from '@/components/Modal/index';
import Card from '@/components/Card/index';
import Content from '@/components/Content/index';
import { AccountLayout } from '@/layouts/index';
import api from '@/lib/common/api';
import { useWorkspace } from '@/providers/workspace';
import { getSession } from 'next-auth/react';
import { getWorkspace, isWorkspaceCreator } from '@/prisma/services/workspace';
import Input from '@/components/Input/index';

const Advanced = ({ isCreator }) => {
  const { setWorkspace, workspace } = useWorkspace();

  const router = useRouter();
  const { workspaceSlug } = router.query;

  const [isSubmitting, setSubmittingState] = useState(false);
  const [showModal, setModalState] = useState(false);
  const [verifyWorkspace, setVerifyWorkspace] = useState('');
  const verifiedWorkspace = verifyWorkspace === workspace?.slug;
  const [company, setCompany] = useState({});
  const [searchResult, setSearchResult] = useState([]);
  const [name, setName] = useState('');



  const search = async (e) => {

    e.preventDefault();
    const res = await api(`/api/company?name=${name}`, {
      method: 'GET'
    })
    setSearchResult(res.comps.entities)
    toggleModal()
  }

  const handelCompany = async (data) => {
    console.log(data)
    router.push(`/account/${workspaceSlug}/company/${data.identifier.value}`)
  }

  const toggleModal = () => {
    setVerifyWorkspace('');
    setModalState(!showModal);
  };

  return (
    <AccountLayout>
      <Meta title={`Vagabond - ${workspace?.name} | Company Settings`} />
      <Content.Title
        title="Company Settings"
        subtitle="Manage your company settings"
      />
      <Content.Divider />
      <Content.Container>
        <Card>
          <Card.Body
            title="Register Company"
            subtitle="Register your company to get access to more features."
          />

          <Card.Footer>
            <small className='text-gray-800'>
              Search and register your company to this Workspace.
            </small>
            {isCreator && (
              <Button
                className="text-white bg-red-600 hover:bg-red-500"
                disabled={isSubmitting}
                onClick={toggleModal}
              >
                {isSubmitting ? 'Searching' : 'Search'}
              </Button>
            )}
          </Card.Footer>
          <div className="px-4 my-10">
            <ul role="list" className="divide-y divide-gray-200">
              {searchResult?.map((item, index) => (
                <li key={index} className="flex py-4 justify-between">
                  <div className="flex">
                    <img className="h-10 w-10 rounded-full" src={`https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_170,w_170,f_auto,b_white,q_auto:eco,dpr_1/${item.identifier.image_id}`} alt="" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{item.identifier.value}</p>
                      <p className="text-xs text-gray-400">{item.short_description}</p>
                    </div>
                  </div>
                  <div>
                    <Button className="bg-red-600 text-white hover:bg-red-500" onClick={() => handelCompany(item)}>Select</Button>
                  </div>

                </li>
              ))}
            </ul>
          </div>


          <Modal
            show={showModal}
            title="Search for your company"
            toggle={toggleModal}
          >
            <p className="flex flex-col">
              <span>
                Please search and register your company.
              </span>
              <span>
                We will verify your association with this entity and add this company to your workspace.
              </span>
            </p>

            <div className="flex flex-col">
              <label className="text-sm text-gray-400">
                Enter your Company Name to continue:
              </label>
              <Input type="text" placeholder="Company Name" onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="flex flex-col items-stretch">
              <Button
                className="text-white bg-red-600 hover:bg-red-500"
                disabled={isSubmitting}
                onClick={search}
              >
                <span>Search</span>
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
  let isCreator = false;

  if (session) {
    const workspace = await getWorkspace(
      session.user.userId,
      session.user.email,
      context.params.workspaceSlug
    );

    isCreator = isWorkspaceCreator(session.user.userId, workspace[0].creatorId);
  }
  return { props: { isCreator } };
};

export default Advanced;
