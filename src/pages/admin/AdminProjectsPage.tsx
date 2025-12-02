/**
 * Admin Projects Page - Modern Tailwind v4 Version
 *
 * 프로젝트 관리 페이지 (관리자 전용)
 * h-creations.com 스타일의 미니멀한 디자인
 * 드래그 앤 드롭으로 프로젝트 순서 변경 지원
 */

import { useState, useMemo } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
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
  useUpdateProjectsOrderMutation,
} from '../../features/portfolio/api/projectsApi';
import { Loader2, Plus, Edit2, Trash2, Star, Eye, Heart, MessageCircle, GripVertical } from 'lucide-react';

/**
 * Sortable Table Row Component
 */
interface SortableRowProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: string, title: string) => void;
  onToggleFeatured: (id: string, featured: boolean) => void;
}

const SortableRow = ({ project, onEdit, onDelete, onToggleFeatured }: SortableRowProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={`hover:bg-muted/30 transition-colors ${isDragging ? 'bg-muted/50' : ''}`}
    >
      {/* Drag Handle */}
      <td className="px-3 py-4 w-10">
        <button
          {...attributes}
          {...listeners}
          className="p-1 rounded hover:bg-muted cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors"
          title="드래그하여 순서 변경"
        >
          <GripVertical className="w-4 h-4" />
        </button>
      </td>

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
          onClick={() => onToggleFeatured(project.id, project.featured)}
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
            onClick={() => onEdit(project)}
            className="p-2 rounded-md hover:bg-muted transition-colors text-foreground"
            title="수정"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(project.id, project.title)}
            className="p-2 rounded-md hover:bg-destructive/10 transition-colors text-destructive"
            title="삭제"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

/**
 * Sortable Mobile Card Component
 */
const SortableMobileCard = ({ project, onEdit, onDelete, onToggleFeatured }: SortableRowProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-4 rounded-lg border border-border bg-card space-y-3 ${isDragging ? 'shadow-lg' : ''}`}
    >
      {/* Header with Drag Handle */}
      <div className="flex items-start justify-between gap-2">
        <button
          {...attributes}
          {...listeners}
          className="p-1 rounded hover:bg-muted cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
          title="드래그하여 순서 변경"
        >
          <GripVertical className="w-4 h-4" />
        </button>
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
          onClick={() => onToggleFeatured(project.id, project.featured)}
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
          onClick={() => onEdit(project)}
          className="px-3 py-2 rounded-md hover:bg-muted transition-colors text-foreground"
          title="수정"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(project.id, project.title)}
          className="px-3 py-2 rounded-md hover:bg-destructive/10 transition-colors text-destructive"
          title="삭제"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export const AdminProjectsPage = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [localProjects, setLocalProjects] = useState<Project[]>([]);
  const { showAlert } = useAlertModal();
  const { showConfirm } = useConfirmModal();

  // RTK Query hooks
  const { data, isLoading: loading, error } = useGetProjectsQuery({ limit: 100, sort: 'default' });
  const [deleteProject] = useDeleteProjectMutation();
  const [updateProject] = useUpdateProjectMutation();
  const [createProject] = useCreateProjectMutation();
  const [updateProjectsOrder, { isLoading: isSavingOrder }] = useUpdateProjectsOrderMutation();

  // Sync local state with fetched data
  const projects = useMemo(() => {
    if (data?.items && localProjects.length === 0) {
      return data.items;
    }
    return localProjects.length > 0 ? localProjects : (data?.items || []);
  }, [data?.items, localProjects]);

  // Update local state when data changes
  useMemo(() => {
    if (data?.items && localProjects.length === 0) {
      setLocalProjects(data.items);
    }
  }, [data?.items]);

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Project IDs for sortable context
  const projectIds = useMemo(() => projects.map(p => p.id), [projects]);

  // Handle drag end
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = projects.findIndex(p => p.id === active.id);
      const newIndex = projects.findIndex(p => p.id === over.id);

      const newProjects = arrayMove(projects, oldIndex, newIndex);
      setLocalProjects(newProjects);

      // Update sort_order in database
      const updates = newProjects.map((project, index) => ({
        id: project.id,
        sortOrder: index,
      }));

      try {
        await updateProjectsOrder(updates).unwrap();
        showAlert({
          title: '순서 저장',
          message: '프로젝트 순서가 저장되었습니다.',
          type: 'success',
        });
      } catch {
        // Revert on error
        setLocalProjects(data?.items || []);
        showAlert({
          title: '순서 저장 실패',
          message: '프로젝트 순서 저장에 실패했습니다.',
          type: 'error',
        });
      }
    }
  };

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

        {/* Saving indicator */}
        {isSavingOrder && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-accent/10 border border-accent/20">
            <Loader2 className="w-4 h-4 animate-spin text-accent" />
            <span className="text-sm text-accent">순서 저장 중...</span>
          </div>
        )}

        {/* Drag and Drop Context */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={projectIds} strategy={verticalListSortingStrategy}>
            {/* Projects Table - Desktop */}
            <div className="hidden md:block overflow-hidden rounded-lg border border-border bg-card">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="px-3 py-3 w-10 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        순서
                      </th>
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
                      <SortableRow
                        key={project.id}
                        project={project}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onToggleFeatured={toggleFeatured}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Projects Cards - Mobile */}
            <div className="md:hidden space-y-4">
              {projects.map((project) => (
                <SortableMobileCard
                  key={project.id}
                  project={project}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onToggleFeatured={toggleFeatured}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

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
