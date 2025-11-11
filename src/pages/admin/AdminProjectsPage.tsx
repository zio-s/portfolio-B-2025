/**
 * Admin Projects Page - Modern Tailwind v4 Version
 *
 * 프로젝트 관리 페이지 (관리자 전용)
 * h-creations.com 스타일의 미니멀한 디자인
 */

import { useState } from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { ProjectForm } from '../../components/admin/ProjectForm';
import { useAlertModal } from '@/components/modal/hooks/use-alert-modal';
import { useConfirmModal } from '@/components/modal/hooks/use-confirm-modal';
import type { Project } from '../../features/portfolio/types/Project';
import {
  useGetProjectsQuery,
  useDeleteProjectMutation,
  useUpdateProjectMutation,
  useCreateProjectMutation,
} from '../../features/portfolio/api/projectsApi';
import { Loader2, Plus, Edit2, Trash2, Star, Eye, Heart, MessageCircle } from 'lucide-react';

export const AdminProjectsPage = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const { showAlert } = useAlertModal();
  const { showConfirm } = useConfirmModal();

  // RTK Query hooks
  const { data, isLoading: loading, error } = useGetProjectsQuery({ limit: 100 });
  const [deleteProject] = useDeleteProjectMutation();
  const [updateProject] = useUpdateProjectMutation();
  const [createProject] = useCreateProjectMutation();

  const projects = data?.items || [];

  const handleDelete = async (id: string, title: string) => {
    showConfirm({
      title: '프로젝트 삭제',
      message: `"${title}"을(를) 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`,
      type: 'danger',
      confirmText: '삭제',
      cancelText: '취소',
      onConfirm: async () => {
        try {
          await deleteProject(id).unwrap();
          showAlert({
            title: '삭제 완료',
            message: '프로젝트가 삭제되었습니다.',
            type: 'success',
          });
        } catch {
          showAlert({
            title: '삭제 실패',
            message: '프로젝트 삭제에 실패했습니다.',
            type: 'error',
          });
        }
      },
    });
  };

  const toggleFeatured = async (id: string, currentFeatured: boolean) => {
    try {
      await updateProject({
        id,
        featured: !currentFeatured,
      }).unwrap();

      showAlert({
        title: currentFeatured ? '고정 해제' : '고정 완료',
        message: currentFeatured
          ? '프로젝트 고정이 해제되었습니다.'
          : '프로젝트가 Featured로 고정되었습니다.',
        type: 'success',
      });
    } catch {
      showAlert({
        title: 'Featured 설정 실패',
        message: 'Featured 상태 변경에 실패했습니다.',
        type: 'error',
      });
    }
  };

  const handleCreate = () => {
    setEditingProject(null);
    setIsFormOpen(true);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (data: Partial<Project>) => {
    try {
      if (editingProject) {
        await updateProject({
          id: editingProject.id,
          ...data,
        }).unwrap();

        showAlert({
          title: '수정 완료',
          message: '프로젝트가 수정되었습니다.',
          type: 'success',
        });
      } else {
        await createProject(data as Parameters<typeof createProject>[0]).unwrap();

        showAlert({
          title: '생성 완료',
          message: '프로젝트가 생성되었습니다.',
          type: 'success',
        });
      }

      setIsFormOpen(false);
      setEditingProject(null);
    } catch (err) {
      showAlert({
        title: '저장 실패',
        message: '프로젝트 저장에 실패했습니다.',
        type: 'error',
      });

      throw err;
    }
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setEditingProject(null);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
            <p className="text-sm text-muted-foreground mt-1">
              포트폴리오 프로젝트를 관리합니다
            </p>
          </div>
          <button
            onClick={handleCreate}
            className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg font-medium hover:bg-accent/90 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            새 프로젝트
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
            <p className="text-sm text-destructive">
              프로젝트를 불러올 수 없습니다. 다시 시도해주세요.
            </p>
          </div>
        )}

        {/* Projects Table - Desktop */}
        <div className="hidden md:block overflow-hidden rounded-lg border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    제목
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    카테고리
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Featured
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    통계
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    관리
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-muted/30 transition-colors">
                    {/* Title & Description */}
                    <td className="px-6 py-4">
                      <div className="max-w-md">
                        <div className="font-semibold text-sm mb-1">{project.title}</div>
                        <div className="text-xs text-muted-foreground line-clamp-2">
                          {project.description}
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-accent/10 text-accent border border-accent/20">
                        {project.category}
                      </span>
                    </td>

                    {/* Featured Toggle */}
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => toggleFeatured(project.id, project.featured)}
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                          project.featured
                            ? 'bg-accent text-white hover:bg-accent/90'
                            : 'bg-muted text-muted-foreground hover:bg-muted/80'
                        }`}
                      >
                        <Star
                          className={`w-3 h-3 ${project.featured ? 'fill-current' : ''}`}
                        />
                        {project.featured ? 'YES' : 'NO'}
                      </button>
                    </td>

                    {/* Stats */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {project.stats.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          {project.stats.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-3 h-3" />
                          {project.stats.comments}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(project)}
                          className="p-2 rounded-md hover:bg-muted transition-colors text-foreground"
                          title="수정"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(project.id, project.title)}
                          className="p-2 rounded-md hover:bg-destructive/10 transition-colors text-destructive"
                          title="삭제"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Projects Cards - Mobile */}
        <div className="md:hidden space-y-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="p-4 rounded-lg border border-border bg-card space-y-3"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm mb-1 truncate">{project.title}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {project.description}
                  </p>
                </div>
                {project.featured && (
                  <Star className="w-4 h-4 text-accent fill-current flex-shrink-0" />
                )}
              </div>

              {/* Category */}
              <div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-accent/10 text-accent border border-accent/20">
                  {project.category}
                </span>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {project.stats.views}
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="w-3 h-3" />
                  {project.stats.likes}
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="w-3 h-3" />
                  {project.stats.comments}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-2 border-t border-border">
                <button
                  onClick={() => toggleFeatured(project.id, project.featured)}
                  className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                    project.featured
                      ? 'bg-accent text-white hover:bg-accent/90'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  <Star className={`w-3 h-3 ${project.featured ? 'fill-current' : ''}`} />
                  {project.featured ? 'Featured' : 'Not Featured'}
                </button>
                <button
                  onClick={() => handleEdit(project)}
                  className="px-3 py-2 rounded-md hover:bg-muted transition-colors text-foreground"
                  title="수정"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(project.id, project.title)}
                  className="px-3 py-2 rounded-md hover:bg-destructive/10 transition-colors text-destructive"
                  title="삭제"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Total Count */}
        <div className="text-sm text-muted-foreground">
          전체 <span className="font-semibold text-foreground">{projects.length}</span>개의
          프로젝트
        </div>
      </div>

      {/* Project Form Modal */}
      <ProjectForm
        project={editingProject}
        onSubmit={handleFormSubmit}
        onCancel={handleFormCancel}
        isOpen={isFormOpen}
      />
    </AdminLayout>
  );
};

export default AdminProjectsPage;
